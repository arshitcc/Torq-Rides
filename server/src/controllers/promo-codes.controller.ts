import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import { PromoCodeTypeEnum } from "../constants/constants";
import { PromoCode } from "../models/promo-codes.model";
import mongoose from "mongoose";

const createCoupon = asyncHandler(async (req: CustomRequest, res: Response) => {
  const {
    name,
    promoCode,
    type = PromoCodeTypeEnum.FLAT,
    discountValue,
    minimumCartValue,
    startDate,
    expiryDate,
  } = req.body;

  const duplicateCoupon = await PromoCode.findOne({
    promoCode: promoCode.trim().toUpperCase(),
  });

  if (duplicateCoupon) {
    throw new ApiError(
      409,
      "Coupon with code " + duplicateCoupon.promoCode + " already exists",
    );
  }

  if (minimumCartValue && +minimumCartValue < +discountValue) {
    throw new ApiError(
      400,
      "Minimum cart value must be greater than or equal to the discount value",
    );
  }

  const coupon = await PromoCode.create({
    name,
    promoCode,
    type,
    discountValue,
    minimumCartValue,
    startDate,
    expiryDate,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, true, "Coupon created successfully", coupon));
});

const updateCouponActiveStatus = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { isActive } = req.body;
    const { couponId } = req.params;

    const updatedCoupon = await PromoCode.findByIdAndUpdate(
      couponId,
      { $set: { isActive } },
      { new: true },
    );

    if (!updatedCoupon) {
      throw new ApiError(404, "Coupon does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          `Promo-Code ${updatedCoupon.promoCode} is ${
            updatedCoupon?.isActive ? "active" : "inactive"
          }`,
          updatedCoupon,
        ),
      );
  },
);

const getAllCoupons = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { page, offset } = req.query;

    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(Number(page), 1);
    const limit = Number.isNaN(Number(offset)) ? 10 : Math.max(Number(offset), 1);
    const skip = (pageNum - 1) * limit;

    const { active } = req.query;

    let matchStage: Record<string, any> = {};
    if (active) {
      matchStage.isActive = active;
    }

    const promoCodes = await PromoCode.aggregate([
      { $sort: { updateCoupon: -1 } },
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
        new ApiResponse(200, true, "Coupons fetched successfully", promoCodes[0]),
      );
  },
);

const getCouponById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { couponId } = req.params;

    const coupon = await PromoCode.findById(couponId);
    if (!coupon) {
      throw new ApiError(404, "Coupon does not exist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, true, "Coupon Fetched successfully", coupon));
  },
);

const updateCoupon = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { couponId } = req.params;
  const {
    name,
    promoCode,
    type = PromoCodeTypeEnum.FLAT,
    discountValue,
    minimumCartValue,
    startDate,
    expiryDate,
  } = req.body;

  const couponToBeUpdated = await PromoCode.findById(couponId);

  if (!couponToBeUpdated) {
    throw new ApiError(404, "Coupon does not exist");
  }

  const duplicateCoupon = await PromoCode.aggregate([
    {
      $match: {
        promoCode: promoCode?.trim().toUpperCase(),
        _id: {
          $ne: new mongoose.Types.ObjectId(couponToBeUpdated._id),
        },
      },
    },
  ]);

  if (duplicateCoupon[0]) {
    throw new ApiError(
      409,
      "Coupon with code " + duplicateCoupon[0].promoCode + " already exists",
    );
  }

  const _minimumCartValue =
    minimumCartValue || couponToBeUpdated.minimumCartValue;
  const _discountValue = discountValue || couponToBeUpdated.discountValue;

  if (_minimumCartValue && +_minimumCartValue < +_discountValue) {
    throw new ApiError(
      400,
      "Minimum cart value must be greater than or equal to the discount value",
    );
  }

  const coupon = await PromoCode.findByIdAndUpdate(
    couponId,
    {
      $set: {
        name,
        promoCode,
        type,
        discountValue: _discountValue,
        minimumCartValue: _minimumCartValue,
        startDate,
        expiryDate,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Coupon updated successfully", coupon));
});

const deleteCoupon = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { couponId } = req.params;

  const deletedCoupon = await PromoCode.findByIdAndDelete(couponId);
  if (!deletedCoupon) {
    throw new ApiError(404, "Coupon does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, true, "Coupon deleted successfully"));
});

export {
  createCoupon,
  updateCouponActiveStatus,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
