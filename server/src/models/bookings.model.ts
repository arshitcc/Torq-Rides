import mongoose from "mongoose";
import { IUser } from "./users.model";

export const BookingStatusEnum = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const AvailableBookingStatus = Object.values(BookingStatusEnum);

export type BookingStatus = (typeof AvailableBookingStatus)[number];

export interface IBooking extends mongoose.Document {
  customerId: mongoose.Types.ObjectId;
  motorcycleId: mongoose.Types.ObjectId;
  quantity: number;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  bookingDate: Date;
  customer: IUser;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    motorcycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Motorcycle",
      required: true,
    },
    quantity: {
      // >=1
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableBookingStatus,
      default: BookingStatusEnum.PENDING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
