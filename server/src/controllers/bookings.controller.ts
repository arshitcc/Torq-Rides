import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest, User } from "../models/users.model";
import { Response } from "express";
import {
  AvailableBookingStatus,
  Booking,
  BookingStatus,
  BookingStatusEnum,
  PaymentStatusEnum,
} from "../models/bookings.model";
import { Motorcycle } from "../models/motorcycles.model";
import mongoose from "mongoose";
import { PaymentProviderEnum, UserRolesEnum } from "../constants/constants";
import { paypalAPI } from "../utils/paypal";
import { Cart, ICartItem } from "../models/carts.model";
import { getCart } from "./carts.controller";
import razorpayInstance from "../utils/razorpay";
import { nanoid } from "nanoid";
import crypto from "crypto";
import { RAZORPAY_KEY_SECRET } from "../utils/env";
import { bookingConfirmationTemplate, sendEmail } from "../utils/mail";

const handleBooking = async (
  bookingPaymentId: string,
  req: CustomRequest,
  amount: number,
) => {
  const order = await Booking.findOne({
    paymentId: bookingPaymentId,
    status: BookingStatusEnum.PENDING,
  });

  if (!order) {
    throw new ApiError(404, "Booking does not exist");
  }

  order.status = BookingStatusEnum.CONFIRMED;
  order.paidAmount += amount;
  order.remainingAmount -= amount;
  order.paymentStatus =
    order.remainingAmount === 0
      ? PaymentStatusEnum.FULLY_PAID
      : PaymentStatusEnum.PARTIAL;
  await order.save({ validateBeforeSave: false });

  const cart = await Cart.findOne({ customerId: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart does not exist");
  }

  const userCart = await getCart(req.user._id as string);

  const bulkStockUpdates = userCart.items.map((item: ICartItem) => ({
    updateOne: {
      filter: {
        _id: item.motorcycleId,
        "availableInCities.branch": item.pickupLocation,
      },
      update: {
        $inc: { "availableInCities.$.quantity": -item.quantity },
      },
    },
  }));

  /* 
    (bulkWrite()) is faster than sending multiple independent operations (e.g. if you use create()) 
    because with bulkWrite() there is only one network round trip to the MongoDB server.
  */

  await Motorcycle.bulkWrite(bulkStockUpdates, {
    skipValidation: true,
  });

  await sendEmail({
    email: req.user?.email,
    subject: "Order confirmed",
    template: bookingConfirmationTemplate({
      username: req.user?.username,
      booking: order,
      totalAmount: order.discountedTotal ?? 0,
    }),
  });

  cart.items = []; // empty the cart
  cart.couponId = null;

  await cart.save({ validateBeforeSave: false });
  return order;
};

export const getbooking = async (
  id: string,
  pageNum: number,
  limit: number,
  skip: number,
  role: string,
) => {
  let pipeline = [];

  if (role === UserRolesEnum.CUSTOMER)
    pipeline.push({
      $match: {
        customerId: new mongoose.Types.ObjectId(id),
      },
    });
  else
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      },
    });

  const bookingAggregation = await Booking.aggregate([
    // 1) JOIN user
    ...pipeline,
    { $addFields: { customer: { $arrayElemAt: ["$customer", 0] } } },

    // 2) UNWIND the items array
    { $unwind: "$items" },

    // 3) JOIN each motorcycle, dropping its maintenanceLogs
    {
      $lookup: {
        from: "motorcycles",
        let: { mid: "$items.motorcycleId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$mid"] } } },
          { $project: { maintenanceLogs: 0 } },
        ],
        as: "items.motorcycle",
      },
    },
    // flatten the lookup array
    {
      $addFields: {
        "items.motorcycle": { $arrayElemAt: ["$items.motorcycle", 0] },
      },
    },

    // 4) RE‑GROUP back to one document per booking
    {
      $group: {
        _id: "$_id",
        customerId: { $first: "$customerId" },
        status: { $first: "$status" },
        location: { $first: "$location" },
        paymentProvider: { $first: "$paymentProvider" },
        paymentId: { $first: "$paymentId" },
        bookingDate: { $first: "$bookingDate" },
        isAvailable: { $first: "$isAvailable" },
        paymentStatus: { $first: "$paymentStatus" },
        rentTotal: { $first: "$rentTotal" },
        securityDepositTotal: { $first: "$securityDepositTotal" },
        cartTotal: { $first: "$cartTotal" },
        discountedTotal: { $first: "$discountedTotal" },
        paidAmount: { $first: "$paidAmount" },
        remainingAmount: { $first: "$remainingAmount" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        customer: { $first: "$customer" },
        items: { $push: "$items" },
        couponId: { $first: "$couponId" },
      },
    },

    // 5) LOOKUP coupon to get discountValue
    {
      $lookup: {
        from: "promocodes",
        localField: "couponId",
        foreignField: "_id",
        as: "coupon",
      },
    },
    { $addFields: { coupon: { $arrayElemAt: ["$coupon", 0] } } },

    { $sort: { bookingDate: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  return (
    bookingAggregation[0] ?? {
      _id: null,
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
      rentTotal: 0,
      securityDepositTotal: 0,
    }
  );
};

const getAllBookings = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { page, offset } = req.query;

    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(Number(page), 1);
    const limit = Number.isNaN(Number(offset))
      ? 10
      : Math.max(Number(offset), 1);
    const skip = (pageNum - 1) * limit;

    const matchStage: Record<string, any> = {};

    const { status, customerId, bookingDate } = req.query;

    if (status) matchStage.status = status;
    if (bookingDate) matchStage.bookingDate = bookingDate;
    if (customerId) {
      if (req.user.role !== UserRolesEnum.CUSTOMER) {
        matchStage.customerId = new mongoose.Types.ObjectId(
          customerId.toString(),
        );
      } else {
        matchStage.customerId = new mongoose.Types.ObjectId(
          req.user._id?.toString(),
        );
      }
    } else if (req.user.role === UserRolesEnum.CUSTOMER) {
      matchStage.customerId = new mongoose.Types.ObjectId(
        req.user._id?.toString(),
      );
    }

    let pipeline = [];

    if (Object.keys(matchStage).length) pipeline.push({ $match: matchStage });

    if (req.user.role === UserRolesEnum.ADMIN) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, fullname: 1 } }],
          as: "customer",
        },
      });
      pipeline.push({
        $addFields: { customer: { $arrayElemAt: ["$customer", 0] } },
      });
    }

    const bookings = await Booking.aggregate([
      ...pipeline,
      { $unwind: "$items" },
      {
        $lookup: {
          from: "motorcycles",
          let: { mid: "$items.motorcycleId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$mid"] } } },
            { $project: { maintenanceLogs: 0 } },
          ],
          as: "items.motorcycle",
        },
      },
      // flatten the lookup array
      {
        $addFields: {
          "items.motorcycle": { $arrayElemAt: ["$items.motorcycle", 0] },
        },
      },

      // 4) RE‑GROUP back to one document per booking
      {
        $group: {
          _id: "$_id",
          customerId: { $first: "$customerId" },
          status: { $first: "$status" },
          location: { $first: "$location" },
          paymentProvider: { $first: "$paymentProvider" },
          paymentId: { $first: "$paymentId" },
          bookingDate: { $first: "$bookingDate" },
          isAvailable: { $first: "$isAvailable" },
          paymentStatus: { $first: "$paymentStatus" },
          rentTotal: { $first: "$rentTotal" },
          securityDepositTotal: { $first: "$securityDepositTotal" },
          cartTotal: { $first: "$cartTotal" },
          discountedTotal: { $first: "$discountedTotal" },
          paidAmount: { $first: "$paidAmount" },
          remainingAmount: { $first: "$remainingAmount" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          customer: { $first: "$customer" },
          items: { $push: "$items" },
          couponId: { $first: "$couponId" },
        },
      },
      {
        $lookup: {
          from: "promocodes",
          localField: "couponId",
          foreignField: "_id",
          as: "coupon",
        },
      },
      { $addFields: { coupon: { $arrayElemAt: ["$coupon", 0] } } },
      { $sort: { bookingDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Bookings fetched successfully",
          bookings[0],
        ),
      );
  },
);

const modifyBooking = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    const modifiedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: req.body.status } },
      { new: true },
    );

    if (!modifiedBooking) {
      throw new ApiError(500, "Something went wrong");
    }

    const customer = await User.findById(modifiedBooking.customerId).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
    );

    return res.status(200).json(
      new ApiResponse(200, true, "Booking modified successfully", {
        modifiedBooking,
        customer: {
          username: customer?.username,
          fullname: customer?.fullname,
        },
      }),
    );
  },
);

const cancelBooking = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    if (
      req.user.role === UserRolesEnum.CUSTOMER &&
      req.user._id?.toString() !== booking.customerId.toString()
    ) {
      throw new ApiError(403, "Unauthorized action");
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: BookingStatusEnum.CANCELLED } },
      { new: true },
    );

    if (!updatedBooking) {
      throw new ApiError(500, "Something went wrong");
    }

    const customer = await User.findById(updatedBooking.customerId).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
    );

    return res.status(200).json(
      new ApiResponse(200, true, "Booking cancelled successfully", {
        updatedBooking,
        customer: {
          username: customer?.username,
          fullname: customer?.fullname,
        },
      }),
    );
  },
);

const generateRazorpayOrder = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!razorpayInstance) {
      console.error("RAZORPAY ERROR: `key_id` is mandatory");
      throw new ApiError(
        500,
        "Internal server error : RAZORPAY ERROR: `key_id` is mandatory",
      );
    }

    const { mode } = req.body;

    if (!mode) {
      throw new ApiError(400, "Mode is required");
    }

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart || !cart.items?.length) {
      throw new ApiError(400, "User cart is empty");
    }
    const orderItems = cart.items;
    const userCart = await getCart(req.user._id as string);

    const totalDiscountedPrice = userCart.discountedTotal;

    let amount = mode === "p" ? 0.2 * userCart.rentTotal : totalDiscountedPrice;

    const orderOptions = {
      amount: amount * 100,
      currency: "INR",
      receipt: nanoid(10),
      payment_capture: 1,
    };

    try {
      const razorpayOrder = await razorpayInstance.orders.create(orderOptions);

      if (!razorpayOrder) {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              false,
              "Something went wrong while initialising the razorpay order.",
            ),
          );
      }

      /* 
        Create an order while we generate razorpay session 
        In case payment is done and there is some network issue in the payment verification API
        We will at least have a record of the order
      */

      const unpaidOrder = await Booking.create({
        cartId: cart._id,
        customerId: req.user._id,
        items: orderItems,
        rentTotal: userCart.rentTotal,
        securityDepositTotal: userCart.securityDepositTotal,
        cartTotal: userCart.cartTotal,
        totalCost: userCart.cartTotal ?? 0,
        discountedTotal: totalDiscountedPrice ?? 0,
        paidAmount: razorpayOrder.amount_paid / 100,
        remainingAmount: totalDiscountedPrice - razorpayOrder.amount_paid / 100,
        paymentProvider: PaymentProviderEnum.RAZORPAY,
        paymentId: razorpayOrder.id,
        couponId: userCart.coupon?._id,
        customer: {
          fullname: req.user.fullname,
          email: req.user.email,
        },
      });

      // payment successful
      if (unpaidOrder) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              true,
              "Razorpay order generated",
              razorpayOrder,
            ),
          );
      } else {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              false,
              "Something went wrong while initialising the razorpay order.",
              null,
            ),
          );
      }
    } catch (err: any) {
      const status = err.statusCode ?? 500;
      const message = err.error?.reason ?? err.message ?? "Unknown error";
      return res
        .status(status)
        .json(new ApiResponse(status, false, message, null));
    }
  },
);

const verifyRazorpayPayment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    let expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await handleBooking(razorpay_order_id, req, amount);
      return res
        .status(201)
        .json(new ApiResponse(201, true, "Order placed successfully", order));
    } else {
      throw new ApiError(400, "Invalid razorpay signature");
    }
  },
);

const generatePaypalOrder = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart || !cart.items?.length) {
      throw new ApiError(400, "Your cart is empty");
    }

    const orderItems = cart.items;
    const userCart = await getCart(req.user._id as string);

    const totalPrice = userCart.cartTotal;
    const totalDiscountedPrice = userCart.discountedTotal;

    const response = await paypalAPI("/", {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (totalDiscountedPrice * 0.011692).toFixed(0),
          },
        },
      ],
    });

    const paypalOrder = await response.json();

    if (paypalOrder?.id) {
      /* 
        Create an order while we generate paypal session 
        In case payment is done and there is some network issue in the payment verification API
        We will at least have a record of the order
      */

      const unpaidOrder = await Booking.create({
        cartId: cart._id,
        customerId: req.user._id,
        totalCost: totalPrice ?? 0,
        discountedTotal: totalDiscountedPrice ?? 0,
        couponId: userCart.coupon?._id,
        items: orderItems,
        paymentProvider: PaymentProviderEnum.PAYPAL,
        paymentId: paypalOrder.id,
      });

      if (unpaidOrder) {
        return res
          .status(201)
          .json(
            new ApiResponse(
              201,
              paypalOrder,
              "Paypal order generated successfully",
            ),
          );
      }
    }
    //  No paypal-order or No unpaidOrder created throw an error
    console.error(
      "Make sure you have provided your PAYPAL credentials in the .env file",
    );
    throw new ApiError(
      500,
      "Something went wrong while initialising the paypal order.",
    );
  },
);

const verifyPaypalPayment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { orderId, amount } = req.body;

    const response = await paypalAPI(`/${orderId}/capture`, {});
    const capturedData = await response.json();

    if (capturedData?.status === "COMPLETED") {
      const order = await handleBooking(capturedData.id, req, amount);

      return res
        .status(200)
        .json(new ApiResponse(200, true, "Order placed successfully", order));
    } else {
      throw new ApiError(500, "Something went wrong with the paypal payment");
    }
  },
);

const updateBookingStatus = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    let booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, "Order does not exist");
    }

    if (booking.status === BookingStatusEnum.COMPLETED) {
      throw new ApiError(400, "Order is already delivered");
    }

    booking = await Booking.findByIdAndUpdate(
      booking,
      {
        $set: {
          status,
        },
      },
      { new: true },
    );
    return res.status(200).json(
      new ApiResponse(200, true, "Order status changed successfully", {
        status,
      }),
    );
  },
);

const getAnalytics = asyncHandler(async (req: CustomRequest, res: Response) => {
  // Assume salesFromDate and salesUptoDate are JS Date objects, and
  // (optionally) reportMonth is an integer 1–12 of the month you want to drill into.
  // If you omit reportMonth, we’ll default to the month of salesFromDate.

  const salesFromDate = new Date(); /* your from date */
  const salesUptoDate = new Date(); /* your upto date */
  const reportMonth = 4; /* optional: a month number 1–12 */

  // Precompute for “current month” logic:
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const endOfMonth =
    reportMonth === thisMonth && now >= salesFromDate
      ? now
      : new Date(thisYear, reportMonth || now.getMonth() + 1, 0, 23, 59, 59);

  const matchStage = {
    $match: {
      bookingDate: {
        $gte: salesFromDate,
        $lte: salesUptoDate,
      },
      status: "COMPLETED", // only count completed bookings
      paymentStatus: "FULLY-PAID", // only fully paid ones
    },
  };

  const lookupMotor = {
    $lookup: {
      from: "motorcycles",
      localField: "items.motorcycleId",
      foreignField: "_id",
      as: "motorcycles",
    },
  };

  const unwindItems = { $unwind: "$items" };
  const addDateFields = {
    $addFields: {
      year: { $year: "$bookingDate" },
      month: { $month: "$bookingDate" },
      day: { $dayOfMonth: "$bookingDate" },
      // week of month (1–5):
      weekOfMonth: {
        $ceil: { $divide: [{ $dayOfMonth: "$bookingDate" }, 7] },
      },
    },
  };

  const facetStage = {
    $facet: {
      // 1) Weekly totals for the “reportMonth”
      weekly: [
        {
          $match: {
            year: thisYear,
            month: reportMonth || thisMonth,
          },
        },
        {
          $group: {
            _id: "$weekOfMonth",
            totalSales: { $sum: "$rentTotal" },
          },
        },
        { $sort: { _id: 1 as const } },
        {
          $project: {
            name: { $concat: ["Week ", { $toString: "$_id" }] },
            weekly: "$totalSales",
            _id: 0,
          },
        },
      ],

      // 2) Monthly totals for the full range
      monthly: [
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalSales: { $sum: "$rentTotal" },
          },
        },
        { $sort: { "_id.year": 1 as const, "_id.month": 1 as const } },
        {
          $project: {
            name: {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id.month",
              ],
            },
            monthly: "$totalSales",
            _id: 0,
          },
        },
      ],

      // 3) Year‑to‑date monthly breakdown for the year of salesFromDate
      yearly: [
        { $match: { year: thisYear } },
        {
          $group: {
            _id: "$month",
            totalSales: { $sum: "$rentTotal" },
          },
        },
        { $sort: { _id: 1 as const } },
        {
          $project: {
            name: {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id",
              ],
            },
            yearly: "$totalSales",
            _id: 0,
          },
        },
      ],

      // 4) Distribution of bookings by motorcycle category
      bikes: [
        unwindItems,
        lookupMotor,
        { $unwind: "$motorcycles" },
        {
          $group: {
            _id: "$motorcycles.category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            name: "$_id",
            value: "$count",
            _id: 0,
          },
        },
      ],
    },
  };

  const analytics = await Booking.aggregate([
    matchStage,
    addDateFields,
    facetStage,
  ]);

  // Then, in your application code, you can merge the three time series
  // (weekly, monthly, yearly) into one `salesData` array by month name,
  // e.g.:
  //   salesData = monthly.map(m => ({
  //     name: m.name,
  //     weekly: (weekly.find(w=>w.name.endsWith(m.name)) || {}).weekly || 0,
  //     monthly: m.monthly,
  //     yearly:  (yearly.find(y=>y.name===m.name)    || {}).yearly  || 0
  //   }));
  //
  // And `bikesSalesData = result[0].bikes`.

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Analytics", analytics));
});

const getMonthlyAndYearlySales = async (
  bookingMonth: number,
  bookingYear: number,
) => {
  const matchStage: Record<string, any> = {
    stage: "COMPLETED",
  };

  await Booking.aggregate([
    {
      $addFields: {
        bookingMonth: "$bookingDate",
        bookingYear: "$bookingDate",
      },
    },
    {
      $match: {
        bookingMonth,
        bookingYear,
        ...matchStage,
      },
    },
  ]);
};

const getDateWiseSales = async (fromDate: Date, toDate: Date) => {
  await Booking.aggregate([
    {
      $match: {
        $gte: fromDate,
        $lte: toDate,
      },
    },
  ]);
};

const getOverview = asyncHandler(async (req: CustomRequest, res: Response) => {
  const {
    month,
    year,
    fromDate,
    toDate,
    onDate,
    today,
    weeklyOfTheMonth,
    monthlyOfTheYear,
    status,
  } = req.query;

  let matchStage: Record<string, any> = {};
  let overview;

  if (
    AvailableBookingStatus.includes(
      status?.toString().toUpperCase() as BookingStatus,
    )
  ) {
    matchStage.status = status?.toString().toUpperCase();
  }

  if (fromDate && toDate) {
    const fromBookingDate = new Date(fromDate as string);
    const toBookingDate = new Date(toDate as string);
    const pipeline: mongoose.PipelineStage[] = [];
    pipeline.push({
      $match: matchStage,
    });
    pipeline.push({
      $match: {
        bookingDate: {
          $gte: fromBookingDate,
          $lte: toBookingDate,
        },
      },
    });
    overview = await Booking.aggregate(pipeline);
  }

  return res.status(200).json(new ApiResponse(200, true, "Showed Bookings !!"));
});

export {
  getAllBookings,
  modifyBooking,
  cancelBooking,
  generateRazorpayOrder,
  verifyRazorpayPayment,
  generatePaypalOrder,
  verifyPaypalPayment,
  updateBookingStatus,
  getAnalytics,
};
