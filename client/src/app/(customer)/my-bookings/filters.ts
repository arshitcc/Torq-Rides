import { BookingStatus, PaymentStatus, Booking } from "@/types";
import { BookingStatusEnum, PaymentStatusEnum } from "@/types";

export const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatusEnum.CONFIRMED:
      return "bg-green-100 text-green-800 border-green-200"; // ✅ Confirmed
    case BookingStatusEnum.RESERVED:
      return "bg-teal-100 text-teal-800 border-teal-200"; // 🟢 Reserved
    case BookingStatusEnum.STARTED:
      return "bg-indigo-100 text-indigo-800 border-indigo-200"; // 🔵 Started
    case BookingStatusEnum.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200"; // 🟡 Pending
    case BookingStatusEnum.CANCELLATION_REQUESTED:
      return "bg-red-100 text-red-800 border-red-200";
    case BookingStatusEnum.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200"; // 🔴 Cancelled
    case BookingStatusEnum.COMPLETED:
      return "bg-blue-100 text-blue-800 border-blue-200"; // 🔷 Completed
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatusEnum.FULLY_PAID:
      return "bg-green-100 text-green-800";
    case PaymentStatusEnum.PARTIAL_PAID:
      return "bg-yellow-100 text-yellow-800";
    case PaymentStatusEnum.UNPAID:
      return "bg-red-100 text-red-800";
    case PaymentStatusEnum.REFUND_IN_PROGRESS:
      return "bg-indigo-100 text-indigo-800";
    case PaymentStatusEnum.FULLY_REFUNDED:
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const isUpcoming = (booking: Booking) => {
  if (!booking.items || booking.items.length === 0) return false;
  return booking.status === BookingStatusEnum.CONFIRMED;
};

export const isPast = (booking: Booking) => {
  if (!booking.items || booking.items.length === 0) return false;
  return booking.status === BookingStatusEnum.COMPLETED;
};

export const isCancelled = (booking: Booking) => {
  if (!booking.items || booking.items.length === 0) return false;
  return booking.status === BookingStatusEnum.CANCELLED;
};
