import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import mongoose from "mongoose";
import { Motorcycle } from "../models/motorcycles.model";
import { deleteFile, uploadFile } from "../utils/cloudinary";

const getAllMotorcycles = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const matchState: Record<string, any> = {};
    const {
      make,
      vehicleModel,
      searchTerm,
      year,
      minPrice,
      maxPrice,
      available,
      page,
      offset,
    } = req.query;

    if (make) matchState.make = make;
    if (vehicleModel) matchState.vehicleModel = vehicleModel;
    if (year) matchState.year = Number(year);
    if(minPrice && maxPrice) matchState.pricePerDay = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (minPrice || maxPrice) {
      matchState.pricePerDay = {};
      if (minPrice) matchState.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) matchState.pricePerDay.$lte = Number(maxPrice);
    }

    if (searchTerm) {
      matchState.$or = [
        { make: { $regex: searchTerm, $options: "i" } },
        { vehicleModel: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (
      available &&
      (available.toString() === "true" || available.toString() === "false")
    ) {
      matchState.isAvailable = available;
    }

    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(Number(page), 1);
    const limit = Number.isNaN(Number(offset))
      ? 10
      : Math.max(Number(offset), 1);
    const skip = (pageNum - 1) * Math.min(limit, 10);

    const motorcycles = await Motorcycle.aggregate([
      {
        $match: matchState,
      },
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
          "Motorcycles Fetched Successfully",
          motorcycles[0],
        ),
      );
  },
);

const addMotorcycle = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      make,
      vehicleModel,
      year,
      pricePerDay,
      description,
      category,
      specs,
    } = req.body;

    const file = req.file?.path;

    if (!file) {
      throw new ApiError(400, "Image is required");
    }

    const image = await uploadFile(file);

    const motorcycle = await Motorcycle.create({
      make,
      vehicleModel,
      year,
      pricePerDay,
      description,
      category,
      image: {
        public_id: image.public_id,
        url: image.secure_url,
        resource_type: image.resource_type,
        format: image.format,
      },
      specs,
    });

    if (!motorcycle) {
      throw new ApiError(400, "Motorcycle could not be created");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          true,
          "Motorcycle Created Successfully",
          motorcycle,
        ),
      );
  },
);

const getMotorcycleById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(motorcycleId) } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "motorcycleId",
          as: "bookings",
          pipeline: [{ $project: { _id: 1 } }],
        },
      },
      {
        $lookup: {
          from: "reviews",
          let: { bookingIds: "$bookings._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$bookingId", "$$bookingIds"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
                pipeline: [{ $project: { username: 1, fullname: 1 } }],
              },
            },
            {
              $addFields: {
                user: { $arrayElemAt: ["$user", 0] },
              },
            },
            {
              $project: {
                rating: 1,
                comment: 1,
                user: 1,
                createdAt: 1,
              },
            },
          ],
          as: "reviews",
        },
      },
      {
        $project: {
          bookings: 0,
        },
      },
    ]);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Motorcycle Fetched Successfully",
          motorcycle[0],
        ),
      );
  },
);

const updateMotorcycleDetails = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    const {
      make,
      vehicleModel,
      year,
      isAvailable,
      pricePerDay,
      description,
      category,
      specs,
    } = req.body;

    const file = req.file?.path;

    if (file) {
      const old_image_public_id = motorcycle?.image?.public_id;
      const image = await uploadFile(file);
      motorcycle.image = {
        public_id: image.public_id,
        url: image.secure_url,
        resource_type: image.resource_type,
        format: image.format,
      };

      if (old_image_public_id) {
        deleteFile(old_image_public_id, image.resource_type);
      }
    }

    if (make) motorcycle.make = make;
    if (vehicleModel) motorcycle.vehicleModel = vehicleModel;
    if (isAvailable) motorcycle.isAvailable = isAvailable;
    if (year) motorcycle.year = year;
    if (pricePerDay) motorcycle.pricePerDay = pricePerDay;
    if (description) motorcycle.description = description;
    if (category) motorcycle.category = category;
    if (specs) motorcycle.specs = specs;

    await motorcycle.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Motorcycle Updated Successfully",
          motorcycle,
        ),
      );
  },
);

const updateMotorcycleMaintainanceLogs = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    const { date, reportMessage, status, cost } = req.body;

    motorcycle.maintainanceLogs.push({
      date,
      reportMessage: reportMessage,
      status: status,
      cost: cost,
    });

    await motorcycle.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Motorcycle Updated Successfully",
          motorcycle,
        ),
      );
  },
);

const deleteMotorcycle = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    await Motorcycle.findByIdAndDelete(motorcycleId);
    deleteFile(motorcycle.image.public_id, motorcycle.image.resource_type);

    return res
      .status(200)
      .json(new ApiResponse(200, true, "Motorcycle Deleted Successfully"));
  },
);

export {
  getAllMotorcycles,
  getMotorcycleById,
  addMotorcycle,
  updateMotorcycleDetails,
  updateMotorcycleMaintainanceLogs,
  deleteMotorcycle,
};
