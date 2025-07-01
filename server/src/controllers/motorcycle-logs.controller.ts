import asyncHandler from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import { MotorcycleLog } from "../models/motorcycle-logs.model";

const createMotorcycleLog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const log = await MotorcycleLog.create(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, true, "Log created successfully", log));
  },
);

const getAllMotorcycleLogs = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const logs = await MotorcycleLog.find().populate("motorcycleId");
    return res.json(
      new ApiResponse(200, true, "Logs fetched successfully", logs),
    );
  },
);

const getMotorcycleLogById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;
    const log =
      await MotorcycleLog.findById(motorcycleId).populate("motorcycleId");

    if (!log) {
      throw new ApiError(404, "Log not found");
    }

    return res.json(
      new ApiResponse(200, true, "Log fetched successfully", log),
    );
  },
);

const updateMotorcycleLog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { motorcycleId } = req.params;
    const updated = await MotorcycleLog.findByIdAndUpdate(
      motorcycleId,
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
    const { motorcycleId } = req.params;
    const deleted = await MotorcycleLog.findByIdAndDelete(motorcycleId);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Log not found" });
    return res.json(new ApiResponse(200, true, "Log deleted successfully"));
  },
);

export {
  createMotorcycleLog,
  getAllMotorcycleLogs,
  getMotorcycleLogById,
  updateMotorcycleLog,
  deleteMotorcycleLog,
};
