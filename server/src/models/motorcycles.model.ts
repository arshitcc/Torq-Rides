import mongoose from "mongoose";

export const MotorcycleStatusEnum = {
  OK: "OK",
  DUE: "DUE-SERVICE",
  IN_SERVICE: "IN-SERVICE",
} as const;

export const MotorcycleCategoryEnum = {
  TOURING: "TOURING",
  SPORTS: "SPORTS",
  CRUISER: "CRUISER",
  ADVENTURE: "ADVENTURE",
  SCOOTER: "SCOOTER",
} as const;

export const AvailableMotorcycleStatus = Object.values(MotorcycleStatusEnum);
export const AvailableMotorcycleCategories = Object.values(
  MotorcycleCategoryEnum,
);

export type MotorcycleStatus = (typeof AvailableMotorcycleStatus)[number];
export type MotorcycleCategory = (typeof AvailableMotorcycleCategories)[number];

export interface File {
  public_id: string;
  url: string;
  resource_type: string;
  format: string;
}

export interface IMotorcycle extends mongoose.Document {
  make: string;
  vehicleModel: string;
  year: number;
  pricePerDay: number;
  description: string;
  category: MotorcycleCategory;
  image: File;
  specs: {
    engine: string;
    power: string;
    weight: string;
  };
  maintainanceLogs: {
    date: Date;
    reportMessage: string;
    status: MotorcycleStatus;
    cost: number;
  }[];
  isAvailable: boolean;
  reviewIds: mongoose.Types.ObjectId[];
}

const motorcycleSchema = new mongoose.Schema<IMotorcycle>(
  {
    make: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category : {
      type : String,
      enum : AvailableMotorcycleCategories,
      required : true
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      resource_type: {
        type: String,
        required: true,
      },
      format: {
        type: String,
        required: true,
      },
    },
    specs: {
      engine: {
        type: String,
        required: true,
      },
      power: {
        type: String,
        required: true,
      },
      weight: {
        type: String,
        required: true,
      },
    },
    maintainanceLogs: [
      {
        date: {
          type: Date,
          required: true,
        },
        reportMessage: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: AvailableMotorcycleStatus,
          default: MotorcycleStatusEnum.OK,
        },
        cost: {
          type: Number,
          default: 0,
        },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    reviewIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true },
);

export const Motorcycle = mongoose.model<IMotorcycle>(
  "Motorcycle",
  motorcycleSchema,
);
