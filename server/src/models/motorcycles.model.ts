import mongoose from "mongoose";

export const MotorcycleStatusEnum = {
  OK: "OK",
  DUE: "DUE-SERVICE",
  IN_SERVICE: "IN-SERVICE",
  IN_REPAIR: "IN-REPAIR",
} as const;

export const MotorcycleCategoryEnum = {
  TOURING: "TOURING",
  SPORTS: "SPORTS",
  CRUISER: "CRUISER",
  ADVENTURE: "ADVENTURE",
  SCOOTER: "SCOOTER",
} as const;

export const AvailableInCitiesEnum = {
  JANAKPURI: "JANAKPURI",
  GURUGRAM_MGROAD: "GURUGRAM-MGROAD",
  GURUGRAM_FARIDABAD: "GURUGRAM-FARIDABAD",
  DELHI: "DELHI",
  NOIDA: "NOIDA",
  NEW_DELHI: "NEW DELHI",
} as const;

export const AvailableMotorcycleStatus = Object.values(MotorcycleStatusEnum);
export const AvailableMotorcycleCategories = Object.values(
  MotorcycleCategoryEnum,
);
export const AvailableInCities = Object.values(AvailableInCitiesEnum);

export type MotorcycleStatus = (typeof AvailableMotorcycleStatus)[number];
export type MotorcycleCategory = (typeof AvailableMotorcycleCategories)[number];
export type AvailableInCities = (typeof AvailableInCities)[number];

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
  rentPerDay: number;
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
  availableQuantity: number;
  reviewIds: mongoose.Types.ObjectId[];
  variant: string;
  color: string;
  securityDeposit: number;
  kmsLimitPerDay: number;
  extraKmsCharges: number;
  images: File[];
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
    rentPerDay: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: AvailableMotorcycleCategories,
      required: true,
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
    availableQuantity: {
      type: Number,
      default: 0,
    },
    variant: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    kmsLimitPerDay: {
      type: Number,
      required: true,
    },
    extraKmsCharges: {
      type: Number,
      required: true,
    },
    images: [
      {
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
    ],
  },
  { timestamps: true },
);

export const Motorcycle = mongoose.model<IMotorcycle>(
  "Motorcycle",
  motorcycleSchema,
);
