import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import {
  Motorcycle,
  MotorcycleCategoryEnum,
} from "../models/motorcycles.model";
import { Cart, ICartItem } from "../models/carts.model";
import mongoose from "mongoose";
import { PromoCodeTypeEnum } from "../constants/constants";

const getBookingPeriod = (
  pickupDate: Date,
  pickupTime: string,
  dropoffDate: Date,
  dropoffTime: string,
) => {
  const pickupDateTime = new Date(pickupDate);
  const [pickupHours, pickupMinutes] = pickupTime.split(":").map(Number);
  pickupDateTime.setHours(pickupHours, pickupMinutes, 0, 0);

  const dropoffDateTime = new Date(dropoffDate);
  const [dropoffHours, dropoffMinutes] = dropoffTime.split(":").map(Number);
  dropoffDateTime.setHours(dropoffHours, dropoffMinutes, 0, 0);

  const diff = dropoffDateTime.getTime() - pickupDateTime.getTime();

  if (diff <= 0) {
    return {
      totalHours: 0,
      duration: "0 days 0 hours",
      weekdayCount: 0,
      weekendCount: 0,
      extraHours: 0,
      lastDayTypeForExtraHours: "weekday" as "weekday" | "weekend",
    };
  }

  const totalHours = diff / (1000 * 60 * 60);
  const fullDays = Math.floor(totalHours / 24);
  const extraHours = totalHours % 24;

  let weekdayCount = 0;
  let weekendCount = 0;
  let lastDayTypeForExtraHours: "weekday" | "weekend" = "weekday";

  let currentDate = new Date(pickupDateTime);

  for (let i = 0; i < fullDays; i++) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      weekdayCount++;
    } else {
      weekendCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (extraHours > 0) {
    const dayOfExtraHours = currentDate.getDay();
    if (dayOfExtraHours >= 1 && dayOfExtraHours <= 4) {
      lastDayTypeForExtraHours = "weekday";
    } else {
      lastDayTypeForExtraHours = "weekend";
    }
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.ceil(totalHours % 24);
  const duration = hours > 0 ? `${days} days ${hours} hours` : `${days} days`;

  return {
    totalHours,
    duration,
    weekdayCount,
    weekendCount,
    extraHours,
    lastDayTypeForExtraHours,
  };
};

const applyDiscountsAndCalculateTotals = (cart: any) => {
  if (!cart || !cart.coupon) {
    cart.items.forEach((item: ICartItem) => {
      item.discountedRentAmount = item.rentAmount;
    });
    cart.rentTotal = cart.items.reduce(
      (sum: number, item: ICartItem) => sum + item.rentAmount,
      0,
    );
    cart.totalTax = cart.items.reduce(
      (sum: number, item: ICartItem) => sum + item.totalTax,
      0,
    );
    cart.discountedRentTotal = cart.rentTotal + cart.totalTax;
    cart.discountedTotal =
      cart.rentTotal + cart.totalTax + cart.securityDepositTotal;
    return cart;
  }

  const { items, coupon } = cart;
  const totalOriginalRent = items.reduce(
    (sum: number, item: ICartItem) => sum + item.rentAmount,
    0,
  );

  if (coupon.type === PromoCodeTypeEnum.PERCENTAGE) {
    items.forEach((item: ICartItem) => {
      const discount = item.rentAmount * (coupon.discountValue / 100);
      item.discountedRentAmount = item.rentAmount - discount;
      // Recalculate tax based on the discounted rent
      item.totalTax = item.discountedRentAmount * (item.taxPercentage / 100);
    });
  } else if (coupon.type === PromoCodeTypeEnum.FLAT) {
    let remainingDiscount = coupon.discountValue;
    let remainingRent = totalOriginalRent;

    items.forEach((item: ICartItem) => {
      // Distribute discount proportionally
      const proportion = item.rentAmount / remainingRent;
      let discountForItem = remainingDiscount * proportion;

      // Cap discount at the item's rent amount
      if (discountForItem > item.rentAmount) {
        discountForItem = item.rentAmount;
      }

      item.discountedRentAmount = item.rentAmount - discountForItem;
      item.totalTax = item.discountedRentAmount * (item.taxPercentage / 100);

      remainingDiscount -= discountForItem;
      remainingRent -= item.rentAmount;
    });

    // Redistribute any leftover discount (if capping occurred)
    if (remainingDiscount > 0) {
      for (const item of items) {
        if (remainingDiscount <= 0) break;
        const availableDiscount = item.discountedRentAmount; // Can't discount below 0
        const discountToApply = Math.min(remainingDiscount, availableDiscount);

        item.discountedRentAmount -= discountToApply;
        item.totalTax = item.discountedRentAmount * (item.taxPercentage / 100);
        remainingDiscount -= discountToApply;
      }
    }
  }

  // Sum up the final totals from the modified items
  cart.rentTotal = totalOriginalRent; // This remains the original total rent
  const finalDiscountedRent = items.reduce(
    (sum: number, item: ICartItem) => sum + item.discountedRentAmount,
    0,
  );
  cart.totalTax = items.reduce(
    (sum: number, item: ICartItem) => sum + item.totalTax,
    0,
  );
  cart.discountedRentTotal = finalDiscountedRent + cart.totalTax;
  cart.discountedTotal =
    finalDiscountedRent + cart.totalTax + cart.securityDepositTotal;

  return cart;
};

export const getCart = async (customerId: string) => {
  await Cart.findOneAndUpdate(
    { customerId: new mongoose.Types.ObjectId(customerId) },
    {
      $pull: {
        items: {
          pickupDate: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      },
    },
    { new: true },
  );

  const cartAggregation = await Cart.aggregate([
    { $match: { customerId: new mongoose.Types.ObjectId(customerId) } },
    { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "motorcycles",
        localField: "items.motorcycleId",
        foreignField: "_id",
        as: "items.motorcycle",
      },
    },
    {
      $addFields: {
        "items.motorcycle": { $arrayElemAt: ["$items.motorcycle", 0] },
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
    {
      $group: {
        _id: "$_id",
        customerId: { $first: "$customerId" },
        couponId: { $first: "$couponId" },
        coupon: { $first: "$coupon" },
        items: { $push: "$items" },
        securityDepositTotal: {
          $sum: {
            $multiply: ["$items.motorcycle.securityDeposit", "$items.quantity"],
          },
        },
      },
    },
  ]);

  if (!cartAggregation.length || !cartAggregation[0]._id) {
    return {
      _id: null,
      items: [],
      rentTotal: 0,
      securityDepositTotal: 0,
      totalTax: 0,
      cartTotal: 0,
      discountedTotal: 0,
    };
  }

  // If cart is empty, items array will contain one empty object, filter it out
  if (
    cartAggregation[0].items.length === 1 &&
    !cartAggregation[0].items[0].motorcycleId
  ) {
    cartAggregation[0].items = [];
  }
  // Apply discount logic in code
  const calculatedCart = applyDiscountsAndCalculateTotals(cartAggregation[0]);

  // Final calculation for cartTotal (pre-discount)
  calculatedCart.cartTotal =
    calculatedCart.rentTotal +
    calculatedCart.totalTax +
    calculatedCart.securityDepositTotal;

  return calculatedCart;
};

const getUserCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  let cart = await getCart(req.user._id as string);

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Cart fetched successfully", cart));
});

const addOrUpdateMotorcycleToCart = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      quantity,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
    }: Omit<
      ICartItem,
      | "duration"
      | "taxPercentage"
      | "totalTax"
      | "rentAmount"
      | "discountedRentAmount"
    > = req.body;

    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    const availableQuantity =
      motorcycle.availableInCities.find(
        (location) => location.branch === pickupLocation,
      )?.quantity ?? 0;

    if (availableQuantity < Number(quantity)) {
      throw new ApiError(
        400,
        availableQuantity > 0
          ? `Only ${availableQuantity} motorcycles available`
          : `Motorcycle is Out of Stock`,
      );
    }

    const pickupDateTime = new Date(pickupDate);
    const [pickupHours, pickupMinutes] = pickupTime.split(":").map(Number);
    pickupDateTime.setHours(pickupHours, pickupMinutes, 0, 0);

    const dropoffDateTime = new Date(dropoffDate);
    const [dropoffHours, dropoffMinutes] = dropoffTime.split(":").map(Number);
    dropoffDateTime.setHours(dropoffHours, dropoffMinutes, 0, 0);

    const totalDurationHours =
      (dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60);

    if (totalDurationHours < 24) {
      throw new ApiError(400, "Minimum booking duration is 24 hours.");
    }

    const {
      duration,
      totalHours,
      weekdayCount,
      weekendCount,
      extraHours,
      lastDayTypeForExtraHours,
    } = getBookingPeriod(
      new Date(pickupDate),
      pickupTime,
      new Date(dropoffDate),
      dropoffTime,
    );

    // Calculate rent based on weekday/weekend rates
    let calculatedRent =
      weekdayCount * motorcycle.pricePerDayMonThu +
      weekendCount * motorcycle.pricePerDayFriSun;

    // Add charges for partial days
    if (extraHours > 0) {
      const partialDayPrice =
        lastDayTypeForExtraHours === "weekday"
          ? motorcycle.pricePerDayMonThu
          : motorcycle.pricePerDayFriSun;

      if (extraHours <= 4) {
        calculatedRent += 0.1 * partialDayPrice;
      } else {
        calculatedRent += partialDayPrice;
      }
    }

    const rentAmount = calculatedRent * quantity;
    const taxPercentage = motorcycle.categories.includes(
      MotorcycleCategoryEnum.ELECTRIC,
    )
      ? parseFloat(process.env.GST_ON_ELECTRIC!)
      : parseFloat(process.env.GST_ON_NON_ELECTRIC!);
    const totalTax = rentAmount * (taxPercentage / 100);

    const cartItemPayload: ICartItem = {
      motorcycleId: new mongoose.Types.ObjectId(motorcycleId),
      quantity,
      pickupDate: new Date(pickupDate),
      dropoffDate: new Date(dropoffDate),
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
      duration,
      totalHours,
      rentAmount,
      taxPercentage,
      totalTax,
      discountedRentAmount: rentAmount,
    };

    const cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      await Cart.create({
        customerId: req.user._id,
        items: [cartItemPayload],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.motorcycleId.toString() === motorcycleId.toString(),
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex] = cartItemPayload;
      } else {
        cart.items.push(cartItemPayload);
      }

      if (cart.couponId) cart.couponId = null;
      await cart.save({ validateBeforeSave: false });
    }

    const finalCart = await getCart(req.user._id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, true, "Cart updated successfully", finalCart));
  },
);

const removeMotorcycleFromCart = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { customerId: req.user._id },
      { $pull: { items: { motorcycleId } } },
      { new: true },
    );

    if (!updatedCart) {
      throw new ApiError(404, "Cart not found");
    }

    let finalCart = await getCart(req.user._id as string);

    if (
      finalCart &&
      finalCart.coupon &&
      finalCart?.cartTotal < finalCart?.coupon?.minimumCartValue
    ) {
      updatedCart.couponId = null;
      await updatedCart.save({ validateBeforeSave: false });
      finalCart = await getCart(req.user._id as string);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, true, "Cart updated successfully", finalCart));
  },
);

const clearCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  await Cart.findOneAndUpdate(
    { customerId: req.user._id },
    {
      $set: {
        items: [],
        couponId: null,
      },
    },
    { new: true },
  );
  const cart = await getCart(req.user._id as string);

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Cart has been cleared", cart));
});

export {
  getUserCart,
  addOrUpdateMotorcycleToCart,
  removeMotorcycleFromCart,
  clearCart,
};
