import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest, User } from "../models/users.model";
import { Response } from "express";
import { Booking, BookingStatusEnum } from "../models/bookings.model";
import { Motorcycle } from "../models/motorcycles.model";
import { PromoCode } from "../models/promo-codes.model";
import mongoose from "mongoose";
import { PromoCodeTypeEnum, UserRolesEnum } from "../constants/constants";

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
    totalCost = motorcycle.pricePerDay * totalDays * quantity;

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

export { getAllBookings, createBooking, modifyBooking, cancelBooking };
