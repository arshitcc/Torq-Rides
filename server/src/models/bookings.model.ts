import mongoose from "mongoose";
import { ICartItem } from "./carts.model";
import { AvailableInCities } from "./motorcycles.model";
import {
  AvailablePaymentProviders,
  PaymentProviderEnum,
} from "../constants/constants";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { CANCELLATION_CHARGE } from "../utils/env";

export const BookingStatusEnum = {
  PENDING: "PENDING",
  RESERVED: "RESERVED",
  CONFIRMED: "CONFIRMED",
  STARTED: "STARTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PaymentStatusEnum = {
  PARTIAL: "PARTIAL-PAID",
  FULLY_PAID: "FULLY-PAID",
  UNPAID: "UNPAID",
  REFUND_INITIATED: "REFUND-INITIATED",
  FULLY_REFUNDED: "REFUNDED",
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
  customer: { fullname: string; email: string };
  cancellationReason: string;
  cancellationCharge: number;
  refundAmount: number;
  couponId: mongoose.Types.ObjectId | null;
  items: ICartItem[];
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
    cancellationReason: {
      type: String,
    },
    cancellationCharge: {
      type: Number,
      default: Number(CANCELLATION_CHARGE),
    },
    refundAmount: {
      type: Number,
      default: 0,
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
          pickupTime: {
            type: String,
            required: true,
          },
          dropoffTime: {
            type: String,
            required: true,
          },
          pickupLocation: {
            type: String,
            enum: AvailableInCities,
            required: true,
          },
          motorcycle: {
            make: String,
            vehicleModel: String,
          },
        },
      ],
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
    customer: {
      fullname: String,
      email: String,
    },
  },
  { timestamps: true },
);

bookingSchema.plugin(mongooseAggregatePaginate);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
