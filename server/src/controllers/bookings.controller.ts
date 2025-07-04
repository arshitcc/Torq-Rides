import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest, User } from "../models/users.model";
import { Response } from "express";
import { Booking, BookingStatusEnum } from "../models/bookings.model";
import { Motorcycle } from "../models/motorcycles.model";
import { PromoCode } from "../models/promo-codes.model";
import mongoose from "mongoose";
import {
  PaymentProviderEnum,
  PromoCodeTypeEnum,
  UserRolesEnum,
} from "../constants/constants";
import { paypalAPI } from "../utils/paypal";
import { Cart, ICartItem } from "../models/carts.model";
import { getCart } from "./carts.controller";
import razorpayInstance from "../utils/razorpay";
import { nanoid } from "nanoid";
import crypto from "crypto";
import { RAZORPAY_KEY_SECRET } from "../utils/env";
import { bookingConfirmationTemplate, sendEmail } from "../utils/mail";

const handleBooking = async (bookingPaymentId: string, req: CustomRequest) => {
  const order = await Booking.findOneAndUpdate(
    { paymentId: bookingPaymentId },
    {
      $set: {
        isPaymentDone: true,
      },
    },
    { new: true },
  );

  if (!order) {
    throw new ApiError(404, "Order does not exist");
  }

  const cart = await Cart.findOne({ customerId: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart does not exist");
  }

  const userCart = await getCart(req.user._id as string);

  let bulkStockUpdates = userCart.items.map((item: ICartItem) => {
    return {
      updateOne: {
        filter: { _id: item.motorcycleId },
        update: { $inc: { availableQuantity: -item.quantity } },
      },
    };
  });

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

    // 6) COMPUTE rentTotal & securityDepositTotal
    {
      $addFields: {
        rentTotal: {
          $sum: {
            $map: {
              input: "$items",
              as: "it",
              in: {
                $multiply: [
                  "$$it.motorcycle.rentPerDay",
                  "$$it.quantity",
                  {
                    // days = returnDate − pickupDate + 1
                    $add: [
                      {
                        $dateDiff: {
                          startDate: "$$it.pickupDate",
                          endDate: "$$it.returnDate",
                          unit: "day",
                        },
                      },
                      1,
                    ],
                  },
                ],
              },
            },
          },
        },
        securityDepositTotal: {
          $sum: {
            $map: {
              input: "$items",
              as: "it",
              in: {
                $multiply: ["$$it.motorcycle.securityDeposit", "$$it.quantity"],
              },
            },
          },
        },
      },
    },

    // 7) COMPUTE cartTotal & discountedTotal
    {
      $addFields: {
        cartTotal: { $add: ["$rentTotal", "$securityDepositTotal"] },
      },
    },

    {
      $addFields: {
        discountedTotal: {
          $ifNull: [
            { $subtract: ["$cartTotal", "$coupon.discountValue"] },
            "$cartTotal",
          ],
        },
      },
    },

    // 8) FINAL PROJECTION
    // {
    //   $project: {
    //     _id: 1,
    //     customerId: 1,
    //     status: 1,
    //     rentTotal: 1,
    //     securityDepositTotal: 1,
    //     discountedTotal: 1,
    //     location: 1,
    //     paymentProvider: 1,
    //     paymentId: 1,
    //     bookingDate: 1,
    //     motorcycle: "$items.motorcycle",
    //     customer: 1,
    //     isAvailable: 1,
    //     items: {
    //       motorcycleId: 1,
    //       quantity: 1,
    //       pickupDate: 1,
    //       returnDate: 1,
    //     },
    //     paymentStatus: 1,
    //     createdAt: 1,
    //     updatedAt: 1,
    //   },
    // },

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

    const { status, customerId, motorcycleId, bookingDate } = req.query;

    if (status) matchStage.status = status;
    if (motorcycleId) matchStage.motorcycleId = motorcycleId;
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

    pipeline.push({ $match: matchStage });
    pipeline.push({
      $lookup: {
        from: "motorcycles",
        localField: "motorcycleId",
        foreignField: "_id",
        as: "motorcycle",
      },
    });
    pipeline.push({
      $addFields: { motorcycle: { $arrayElemAt: ["$motorcycle", 0] } },
    });

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
      { $sort: { bookingDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const mybookings = await getbooking(
      req.user._id?.toString() as string,
      pageNum,
      limit,
      skip,
      req.user.role,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Bookings fetched successfully",
          mybookings || bookings[0],
        ),
      );
  },
);

const createBooking = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.body;

    const motorcycle = await Motorcycle.findById(motorcycleId?.toString());

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    let totalCost = 0;
    const { startDate, endDate, quantity } = req.body;

    if (startDate > endDate) {
      throw new ApiError(400, "Start date must be less than end date");
    }

    const totalDays =
      startDate === endDate
        ? 1
        : Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1;
    totalCost = motorcycle.rentPerDay * totalDays * quantity;

    const { promoCode } = req.body;

    if (promoCode?.trim()) {
      const promoCodeDetails = await PromoCode.findOne({
        promoCode: promoCode.toUpperCase(),
      });

      if (!promoCodeDetails) {
        throw new ApiError(404, "Promo Code not found");
      }

      if (!promoCodeDetails.isActive) {
        throw new ApiError(400, "Offer is no more active");
      }
      if (promoCodeDetails.minimumCartValue > totalCost) {
        throw new ApiError(
          400,
          `Minimum Booking amount is ${promoCodeDetails?.minimumCartValue}`,
        );
      }

      if (promoCodeDetails.type === PromoCodeTypeEnum.FLAT) {
        totalCost -= promoCodeDetails.discountValue;
      } else if (promoCodeDetails.type === PromoCodeTypeEnum.PERCENTAGE) {
        totalCost -= totalCost * (promoCodeDetails.discountValue / 100);
      }
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      motorcycleId,
      quantity,
      startDate,
      endDate,
      totalCost,
      bookingDate: new Date(),
    });

    if (!booking) {
      throw new ApiError(500, "Something went wrong");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, true, "Booking created successfully", booking),
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

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart || !cart.items?.length) {
      throw new ApiError(400, "User cart is empty");
    }
    const orderItems = cart.items;
    const userCart = await getCart(req.user._id as string);

    const totalPrice = userCart.cartTotal;
    const totalDiscountedPrice = userCart.discountedTotal;

    const orderOptions = {
      amount: parseInt(totalDiscountedPrice) * 100,
      currency: "INR",
      receipt: nanoid(10),
    };

    try {
      const razorpayOrder = await razorpayInstance.orders.create(orderOptions);

      /* 
        Create an order while we generate razorpay session 
        In case payment is done and there is some network issue in the payment verification API
        We will at least have a record of the order
      */

      const unpaidOrder = await Booking.create({
        cartId: cart._id,
        customerId: req.user._id,
        items: orderItems,
        totalCost: totalPrice ?? 0,
        discountedTotal: totalDiscountedPrice ?? 0,
        paymentProvider: PaymentProviderEnum.RAZORPAY,
        paymentId: razorpayOrder.id,
        couponId: userCart.coupon?._id,
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    let expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await handleBooking(razorpay_order_id, req);
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
    const { orderId } = req.body;

    const response = await paypalAPI(`/${orderId}/capture`, {});
    const capturedData = await response.json();

    if (capturedData?.status === "COMPLETED") {
      const order = await handleBooking(capturedData.id, req);

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

export {
  getAllBookings,
  createBooking,
  modifyBooking,
  cancelBooking,
  generateRazorpayOrder,
  verifyRazorpayPayment,
  generatePaypalOrder,
  verifyPaypalPayment,
  updateBookingStatus,
};
