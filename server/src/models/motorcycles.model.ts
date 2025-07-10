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
  registrationNumber: string;
  year: number;
  rentPerDay: number;
  description: string;
  category: MotorcycleCategory;
  availableInCities: AvailableInCities[];
  specs: {
    engine: string;
    power: string;
    weight: string;
  };
  isAvailable: boolean;
  availableQuantity: number;
  variant: string;
  color: string;
  securityDeposit: number;
  kmsLimitPerDay: number;
  extraKmsCharges: number;
  images: File[];
  rating: number;
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
    registrationNumber: {
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
    availableInCities: [
      {
        type: String,
        enum: AvailableInCities,
        required: true,
      },
    ],
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export const Motorcycle = mongoose.model<IMotorcycle>(
  "Motorcycle",
  motorcycleSchema,
);
