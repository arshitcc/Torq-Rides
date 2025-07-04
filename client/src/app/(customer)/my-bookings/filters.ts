import { BookingStatus, PaymentStatus, Booking } from "@/types";
import { BookingStatusEnum, PaymentStatusEnum } from "@/types";


export const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatusEnum.CONFIRMED:
      return "bg-green-100 text-green-800 border-green-200";
    case BookingStatusEnum.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case BookingStatusEnum.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    case BookingStatusEnum.COMPLETED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatusEnum.FULLY_PAID:
      return "bg-green-100 text-green-800";
    case PaymentStatusEnum.PARTIAL:
      return "bg-yellow-100 text-yellow-800";
    case PaymentStatusEnum.UNPAID:
      return "bg-red-100 text-red-800";
    case PaymentStatusEnum.REFUNDED:
    case PaymentStatusEnum.FULLY_REFUNDED:
    case PaymentStatusEnum.PARTIAL_REFUNDED:
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
