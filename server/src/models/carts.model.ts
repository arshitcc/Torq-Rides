import mongoose from "mongoose";
import { IMotorcycle } from "./motorcycles.model";

export interface ICartItem {
  motorcycleId: mongoose.Types.ObjectId;
  quantity: number;
  pickupDate: Date;
  dropoffDate: Date;
  pickupTime: string;
  dropoffTime: string;
  motorcycle?: IMotorcycle;
}

export interface ICart extends mongoose.Document {
  customerId: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponId: mongoose.Types.ObjectId | null;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [
        {
          motorcycleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Motorcycle",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          pickupDate: {
            type: Date,
            required: true,
          },
          dropoffDate: {
            type: Date,
            required: true,
          },
          pickupTime: {
            type: String,
            required: true,
          },
          dropoffTime: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromoCode",
      default: null,
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
