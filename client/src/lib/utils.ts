import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BookingPeriod {
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
}

export const getBookingPeriod = ({
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
}: BookingPeriod): {
  totalHours: number;
  duration: string;
  days: number;
  extraHours: number;
} => {
  const pickupDateTime = new Date(pickupDate);
  const [pickupHours, pickupMinutes] = pickupTime.split(":").map(Number);
  pickupDateTime.setHours(pickupHours, pickupMinutes, 0, 0);

  const dropoffDateTime = new Date(dropoffDate);
  const [dropoffHours, dropoffMinutes] = dropoffTime.split(":").map(Number);
  dropoffDateTime.setHours(dropoffHours, dropoffMinutes, 0, 0);

  const diff = dropoffDateTime.getTime() - pickupDateTime.getTime();

  if (diff <= 0) {
    return {
      totalHours: 0,
      duration: "0 days 0 hours",
      days: 0,
      extraHours: 0,
    };
  }

  const totalHours = diff / (1000 * 60 * 60);
  const days = Math.floor(totalHours / 24);
  const extraHours = Math.ceil(totalHours % 24);

  return {
    totalHours,
    duration: `${days} days ${extraHours} hours`,
    days,
    extraHours,
  };
};

export const getFormattedAmount = (amount: number) => {
  return Math.round(amount);
};
