import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import { Motorcycle } from "../models/motorcycles.model";
import { Cart, ICartItem } from "../models/carts.model";
import mongoose from "mongoose";

export const getCart = async (customerId: string) => {
  const cartAggregation = await Cart.aggregate([
    // 1) Only this customer's cart
    {
      $match: {
        customerId: new mongoose.Types.ObjectId(customerId),
      },
    },

    // 2) Unwind items array so we can look up each motorcycle
    { $unwind: "$items" },

    // 3) Lookup the motorcycle document for each item
    {
      $lookup: {
        from: "motorcycles",
        let: { mid: "$items.motorcycleId" },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$mid"] } } }],
        as: "motorcycle",
      },
    },
    // Simplify motorcycle array → single object
    {
      $addFields: {
        "items.motorcycle": { $arrayElemAt: ["$motorcycle", 0] },
      },
    },
    // 4) Compute totalDays for each item
    {
      $addFields: {
        "items.totalDays": {
          $sum: [
            {
              $dateDiff: {
                startDate: "$items.pickupDate",
                endDate: "$items.dropoffDate",
                unit: "day",
              },
            },
            1,
          ],
        },
      },
    },

    // 5) Group back to a single cart document, re‑assembling items[]
    {
      $group: {
        _id: "$_id",
        customerId: { $first: "$customerId" },
        couponId: { $first: "$couponId" },
        items: { $push: "$items" },
      },
    },

    // 6) Optionally, lookup and attach full coupon data
    {
      $lookup: {
        from: "promocodes",
        localField: "couponId",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $addFields: {
        coupon: { $arrayElemAt: ["$coupon", 0] },
      },
    },

    // 7) Calculate cartTotal = sum(items.*)

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
                  "$$it.totalDays",
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

    {
      $addFields: {
        cartTotal: {
          $sum: ["$rentTotal", "$securityDepositTotal"],
        },
      },
    },

    // 8) Final projection
    {
      $project: {
        _id: 1,
        customerId: 1,
        couponId: 1,
        coupon: 1,
        items: 1,
        rentTotal: 1,
        securityDepositTotal: 1,
        cartTotal: 1,
      },
    },
  ]);

  if (!cartAggregation.length) {
    return {
      _id: null,
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
    };
  }

  const ct = cartAggregation[0];

  if (!ct.couponId) {
    ct.discountedTotal = ct.cartTotal;
  } else {
    if (ct.coupon.type === "FLAT") {
      ct.discountedTotal =
        ct.securityDepositTotal + ct.rentTotal - ct.coupon.discountValue;
    } else {
      ct.discountedTotal =
        ct.securityDepositTotal +
        ct.rentTotal -
        ct.rentTotal * (ct.coupon.discountValue / 100);
    }
  }

  await Cart.updateOne(
    { _id: ct._id },
    { $set: { discountedTotal: ct.discountedTotal } },
  );

  return ct;
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
    }: ICartItem = req.body;

    const cart = await Cart.findOne({ customerId: req.user._id });

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

    if (!cart) {
      await Cart.create({
        customerId: req.user._id,
        items: [
          {
            motorcycleId,
            quantity,
            pickupDate,
            dropoffDate,
            pickupTime,
            dropoffTime,
            pickupLocation,
            dropoffLocation,
          },
        ],
      });

      const cart = await getCart(req.user._id as string);

      return res
        .status(200)
        .json(new ApiResponse(200, true, "Cart created successfully", cart));
    }

    const exisitngMotorcycle = cart.items?.find(
      (item) => item.motorcycleId.toString() === motorcycleId.toString(),
    );

    if (exisitngMotorcycle) {
      exisitngMotorcycle.quantity = Number(quantity);
      if (pickupDate) exisitngMotorcycle.pickupDate = pickupDate;
      if (dropoffDate) exisitngMotorcycle.dropoffDate = dropoffDate;
      if (pickupTime) exisitngMotorcycle.pickupTime = pickupTime;
      if (dropoffTime) exisitngMotorcycle.dropoffTime = dropoffTime;
      if (pickupLocation) exisitngMotorcycle.pickupLocation = pickupLocation;
      if (dropoffLocation) exisitngMotorcycle.dropoffLocation = dropoffLocation;
      if (cart.couponId) cart.couponId = null;
    } else {
      cart.items.push({
        motorcycleId: new mongoose.Types.ObjectId(motorcycleId),
        quantity,
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime,
        pickupLocation,
        dropoffLocation,
      });
    }

    await cart.save({ validateBeforeSave: false });

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
      { $pull: { items: { motorcycleId: motorcycleId } } },
      { new: true },
    );

    if (!updatedCart) {
      throw new ApiError(404, "Cart not found");
    }

    let finalCart = await getCart(req.user._id as string);

    if (
      finalCart &&
      finalCart?.cartTotal < finalCart?.coupon?.minimumCartValue
    ) {
      updatedCart.couponId = null;
      await updatedCart.save({ validateBeforeSave: false });
      // fetch the latest updated cart
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
