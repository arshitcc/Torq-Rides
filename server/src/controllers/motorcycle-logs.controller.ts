import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import { MotorcycleLog } from "../models/motorcycle-logs.model";
import mongoose, { isValidObjectId } from "mongoose";

const createMotorcycleLog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;
    if (!isValidObjectId(motorcycleId)) {
      throw new ApiError(404, "Motorcycle not found");
    }
    const log = await MotorcycleLog.create({
      ...req.body,
      motorcycleId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, true, "Log created successfully", log));
  },
);

const getAllMotorcycleLogs = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { page, offset } = req.query;
    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(Number(page), 1);
    const limit = Number.isNaN(Number(offset))
      ? 10
      : Math.max(Number(offset), 1);
    const skip = (pageNum - 1) * Math.min(limit, 10);

    const logs = await MotorcycleLog.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);
    return res.json(
      new ApiResponse(200, true, "Logs fetched successfully", logs[0]),
    );
  },
);

const getMotorcycleLogs = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;
    const logs = await MotorcycleLog.aggregate([
      {
        $match: {
          motorcycleId: new mongoose.Types.ObjectId(motorcycleId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.json(
      new ApiResponse(200, true, "Log fetched successfully", logs),
    );
  },
);

const updateMotorcycleLog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId, logId } = req.params;
    const updated = await MotorcycleLog.findOneAndUpdate(
      { motorcycleId, _id: logId },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updated) {
      throw new ApiError(404, "Log not found");
    }
    return res.json(
      new ApiResponse(200, true, "Log updated successfully", updated),
    );
  },
);

const deleteMotorcycleLog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId, logId } = req.params;
    const deleted = await MotorcycleLog.findOneAndDelete(
      { motorcycleId, _id: logId },
      { isDeleted: true },
    );
    if (!deleted)
      return res.status(404).json(new ApiResponse(404, false, "Log not found"));
    return res.json(new ApiResponse(200, true, "Log deleted successfully"));
  },
);

export {
  createMotorcycleLog,
  getAllMotorcycleLogs,
  getMotorcycleLogs,
  updateMotorcycleLog,
  deleteMotorcycleLog,
};
