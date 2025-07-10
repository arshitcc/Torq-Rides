import mongoose from "mongoose";
import { IUser } from "./users.model";
import { ICartItem } from "./carts.model";
import { AvailableInCities, AvailableInCitiesEnum } from "./motorcycles.model";
import {
  AvailablePaymentProviders,
  PaymentProviderEnum,
} from "../constants/constants";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const BookingStatusEnum = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PaymentStatusEnum = {
  PARTIAL: "PARTIAL-PAID",
  PARTIAL_REFUNDED: "PARTIAL-REFUNDED",
  FULLY_REFUNDED: "FULLY-REFUNDED",
  FULLY_PAID: "FULLY-PAID",
  UNPAID: "UNPAID",
  IN_REFUND: "IN-REFUND",
} as const;

export const AvailableBookingStatus = Object.values(BookingStatusEnum);
export const AvailablePaymentStatus = Object.values(PaymentStatusEnum);

export type BookingStatus = (typeof AvailableBookingStatus)[number];
export type PaymentStatus = (typeof AvailablePaymentStatus)[number];

export interface IBooking extends mongoose.Document {
  customerId: mongoose.Types.ObjectId;
  status: BookingStatus;
  bookingDate: Date;
  rentTotal: number;
  securityDepositTotal: number;
  cartTotal: number;
  discountedTotal: number;
  paidAmount: number;
  remainingAmount: number;
  customer?: IUser;
  couponId: mongoose.Types.ObjectId | null;
  items: ICartItem[];
  location: AvailableInCities;
  paymentProvider: AvailablePaymentProviders;
  paymentId: string;
  paymentStatus: PaymentStatus;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: AvailableBookingStatus,
      default: BookingStatusEnum.PENDING,
    },
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rentTotal: {
      type: Number,
      required: true,
    },
    securityDepositTotal: {
      type: Number,
      required: true,
    },
    cartTotal: {
      type: Number,
      required: true,
    },
    discountedTotal: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromoCode",
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
        },
      ],
    },
    location: {
      type: String,
      enum: AvailableInCities,
      default: AvailableInCitiesEnum.GURUGRAM_MGROAD,
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: AvailablePaymentProviders,
      default: PaymentProviderEnum.UNKNOWN,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: AvailablePaymentStatus,
      default: PaymentStatusEnum.UNPAID,
    },
  },
  { timestamps: true },
);

bookingSchema.plugin(mongooseAggregatePaginate);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
