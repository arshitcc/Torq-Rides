import mongoose from "mongoose";
import { IMotorcycle } from "./motorcycles.model";

export interface ICartItem {
  motorcycleId: mongoose.Types.ObjectId;
  quantity: number;
  pickupDate: Date;
  returnDate: Date;
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
          returnDate: {
            type: Date,
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
