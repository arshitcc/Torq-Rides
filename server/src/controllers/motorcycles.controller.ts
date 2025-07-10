import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import mongoose from "mongoose";
import { Motorcycle } from "../models/motorcycles.model";
import { deleteFile, uploadFile } from "../utils/cloudinary";
import { UserRolesEnum } from "../constants/constants";

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
      isAvailable,
      page,
      offset,
      category,
      availableInCities: cities,
      sort,
    } = req.query;

    if (make) matchState.make = make;
    if (vehicleModel) matchState.vehicleModel = vehicleModel;
    if (category) matchState.category = category;
    if (year) matchState.year = Number(year);
    if (minPrice && maxPrice)
      matchState.rentPerDay = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    if (minPrice || maxPrice) {
      matchState.rentPerDay = {};
      if (minPrice) matchState.rentPerDay.$gte = Number(minPrice);
      if (maxPrice) matchState.rentPerDay.$lte = Number(maxPrice);
    }

    const availableInCities = cities?.toString().split(",");
    if (availableInCities?.length) {
      matchState.availableInCities = { $in: availableInCities };
    }

    if (searchTerm?.toString().trim()) {
      matchState.$or = [
        { make: { $regex: searchTerm, $options: "i" } },
        { vehicleModel: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];

      if (req.user.role === UserRolesEnum.ADMIN) {
        matchState.$or.push({
          registrationNumber: { $regex: searchTerm, $options: "i" },
        });
      }
    }

    if (req.user.role === UserRolesEnum.CUSTOMER) {
      matchState.isAvailable = true;
    } else if (req.user.role !== UserRolesEnum.CUSTOMER) {
      if (isAvailable) {
        matchState.isAvailable = isAvailable === "true" ? true : false;
      }
    }

    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(Number(page), 1);
    const limit = Number.isNaN(Number(offset))
      ? 10
      : Math.max(Number(offset), 1);
    const skip = (pageNum - 1) * Math.min(limit, 12);

    const sortStage: Record<string, 1 | -1> =
      sort === "Newest"
        ? { createdAt: -1 }
        : sort === "LTH"
          ? { rentPerDay: 1 }
          : sort === "HTL"
            ? { rentPerDay: -1 }
            : sort === "Rating"
              ? { rating: -1 }
              : { updatedAt: -1 };

    const motorcycles = await Motorcycle.aggregate([
      {
        $match: matchState,
      },
      {
        $sort: sortStage,
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
      registrationNumber,
      year,
      variant,
      color,
      category,
      availableQuantity,
      description,
      rentPerDay,
      securityDeposit,
      kmsLimitPerDay,
      extraKmsCharges,
      specs,
      isAvailable,
      availableInCities,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    const file = files[0].path;

    if (!file) {
      throw new ApiError(400, "Main Image is required");
    }

    const images = await Promise.all(
      files.map(async (image) => {
        const img = await uploadFile(image.path);
        return {
          public_id: img.public_id,
          url: img.secure_url,
          resource_type: img.resource_type,
          format: img.format,
        };
      }),
    );

    const motorcycle = await Motorcycle.create({
      make,
      vehicleModel,
      year: Number(year),
      rentPerDay: Number(rentPerDay),
      registrationNumber,
      description,
      color,
      variant,
      category,
      images,
      specs,
      isAvailable: Boolean(isAvailable),
      availableQuantity: Number(availableQuantity),
      extraKmsCharges: Number(extraKmsCharges),
      kmsLimitPerDay: Number(kmsLimitPerDay),
      securityDeposit: Number(securityDeposit),
      availableInCities,
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
      registrationNumber,
      year,
      variant,
      color,
      category,
      availableQuantity,
      description,
      rentPerDay,
      securityDeposit,
      kmsLimitPerDay,
      extraKmsCharges,
      specs,
      isAvailable,
      availableInCities,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    const file = files[0].path;

    if (!file) {
      throw new ApiError(400, "Main Image is required");
    }

    const images = await Promise.all(
      files.map(async (image) => {
        const img = await uploadFile(image.path);
        return {
          public_id: img.public_id,
          url: img.secure_url,
          resource_type: img.resource_type,
          format: img.format,
        };
      }),
    );

    motorcycle.make = make;
    motorcycle.vehicleModel = vehicleModel;
    motorcycle.registrationNumber = registrationNumber;
    motorcycle.year = Number(year);
    motorcycle.variant = variant;
    motorcycle.color = color;
    motorcycle.category = category;
    motorcycle.availableQuantity = Number(availableQuantity);
    motorcycle.description = description;
    motorcycle.rentPerDay = Number(rentPerDay);
    motorcycle.securityDeposit = Number(securityDeposit);
    motorcycle.kmsLimitPerDay = Number(kmsLimitPerDay);
    motorcycle.extraKmsCharges = Number(extraKmsCharges);
    motorcycle.specs = specs;
    motorcycle.isAvailable = Boolean(isAvailable);
    motorcycle.availableInCities = availableInCities;
    motorcycle.images.push(
      ...images.map((img) => ({
        public_id: img.public_id,
        url: img.url,
        resource_type: img.resource_type,
        format: img.format,
      })),
    );

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
    motorcycle.images.forEach((image) => {
      deleteFile(image.public_id, image.resource_type);
    });

    return res
      .status(200)
      .json(new ApiResponse(200, true, "Motorcycle Deleted Successfully"));
  },
);

const updateMotorcycleAvailability = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;

    const motorcycle = await Motorcycle.findById(motorcycleId);

    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }

    const { isAvailable } = req.body; // Assuming isAvailable is present in the request body

    motorcycle.isAvailable = isAvailable;

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

const deleteMotorcycleImage = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;
    const { imageId } = req.body;
    const motorcycle = await Motorcycle.findById(motorcycleId);
    if (!motorcycle) {
      throw new ApiError(404, "Motorcycle not found");
    }
    const image = motorcycle.images.find(
      (image) => image.public_id === imageId,
    );
    if (!image) {
      throw new ApiError(404, "Image not found");
    }
    await deleteFile(image.public_id, image.resource_type);
    motorcycle.images = motorcycle.images.filter(
      (image) => image.public_id !== imageId,
    );
    await motorcycle.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, true, "Image deleted successfully"));
  },
);

export {
  getAllMotorcycles,
  getMotorcycleById,
  addMotorcycle,
  updateMotorcycleDetails,
  deleteMotorcycle,
  updateMotorcycleAvailability,
  deleteMotorcycleImage,
};
