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
    {
      $match: {
        customerId: new mongoose.Types.ObjectId(customerId),
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "motorcycles",
        localField: "items.motorcycleId",
        foreignField: "_id",
        as: "motorcycle",
      },
    },
    {
      $project: {
        motorcycle: { $first: "$motorcycle" },
        quantity: "$items.quantity",
        couponId: 1,
        pickupDate: "$items.pickupDate",
        returnDate: "$items.returnDate",
        totalDays: {
          $dateDiff: {
            pickupDate: "$items.pickupDate",
            returnDate: "$items.returnDate",
            unit: "day",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT",
        },
        couponId: { $first: "$couponId" }, // get first value of coupon after grouping
        cartTotal: {
          $sum: {
            $multiply: ["$motorcycle.pricePerDay", "$quantity", "$totalDays"],
          },
        },
      },
    },
    {
      $lookup: {
        // lookup for the coupon
        from: "promocodes",
        localField: "couponId",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $addFields: {
        // As lookup returns an array we access the first item in the lookup array
        coupon: { $first: "$coupon" },
      },
    },
    {
      $addFields: {
        discountedTotal: {
          // Final total is the total we get once user applies any coupon
          // final total is total cart value - coupon's discount value
          $ifNull: [
            {
              $subtract: ["$cartTotal", "$coupon.discountValue"],
            },
            "$cartTotal", // if there is no coupon applied we will set cart total as out final total
            ,
          ],
        },
      },
    },
  ]);

  return (
    cartAggregation[0] ?? {
      _id: null,
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
    }
  );
};

const getUserCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  let cart = await getCart(req.user._id as string);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addOrUpdateMotorcycleToCart = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId, quantity, pickupDate, returnDate }: ICartItem =
      req.body;

    const cart = await Cart.findOne({ customerId: req.user._id });

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    if (motorcycle.availableQuantity < Number(quantity)) {
      throw new ApiError(
        400,
        motorcycle.availableQuantity > 0
          ? `Only ${motorcycle.availableQuantity} motorcycles available`
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
            returnDate,
          },
        ],
      });

      const cart = await getCart(req.user._id as string);

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart created successfully"));
    }

    const exisitngMotorcycle = cart.items?.find(
      (item) => item.motorcycleId.toString() === motorcycleId.toString(),
    );

    if (exisitngMotorcycle) {
      exisitngMotorcycle.quantity = Number(quantity);
      if (pickupDate) exisitngMotorcycle.pickupDate = pickupDate;
      if (returnDate) exisitngMotorcycle.returnDate = returnDate;
      if (cart.couponId) cart.couponId = null;
    }

    await cart.save({ validateBeforeSave: true });

    const finalCart = await getCart(req.user._id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, finalCart, "Cart updated successfully"));
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

    if (finalCart && finalCart.cartTotal < finalCart.coupon.minimumCartValue) {
      updatedCart.couponId = null;
      await updatedCart.save({ validateBeforeSave: false });
      // fetch the latest updated cart
      finalCart = await getCart(req.user._id as string);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, finalCart, "Cart updated successfully"));
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
    .json(new ApiResponse(200, cart, "Cart has been cleared"));
});

export {
  getUserCart,
  addOrUpdateMotorcycleToCart,
  removeMotorcycleFromCart,
  clearCart,
};
