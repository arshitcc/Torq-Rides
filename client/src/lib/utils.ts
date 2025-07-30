import { Motorcycle } from "@/types";
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

export const getBookingPeriod = (
  pickupDate: Date,
  pickupTime: string,
  dropoffDate: Date,
  dropoffTime: string
) => {
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
      weekdayCount: 0,
      weekendCount: 0,
      extraHours: 0,
      lastDayTypeForExtraHours: "weekday" as "weekday" | "weekend",
    };
  }

  const totalHours = diff / (1000 * 60 * 60);
  const fullDays = Math.floor(totalHours / 24);
  const extraHours = totalHours % 24;

  let weekdayCount = 0;
  let weekendCount = 0;
  let lastDayTypeForExtraHours: "weekday" | "weekend" = "weekday";

  let currentDate = new Date(pickupDateTime);

  for (let i = 0; i < fullDays; i++) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      weekdayCount++;
    } else {
      weekendCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (extraHours > 0) {
    const dayOfExtraHours = currentDate.getDay();
    if (dayOfExtraHours >= 1 && dayOfExtraHours <= 4) {
      lastDayTypeForExtraHours = "weekday";
    } else {
      lastDayTypeForExtraHours = "weekend";
    }
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.ceil(totalHours % 24);
  const duration = hours > 0 ? `${days} days ${hours} hours` : `${days} days`;

  return {
    totalHours,
    duration,
    weekdayCount,
    weekendCount,
    extraHours,
    lastDayTypeForExtraHours,
  };
};

export const getFormattedAmount = (amount: number) => {
  return Math.round(amount);
};

export const getTodayPrice = (motorcycle: Motorcycle) => {
  const today = new Date();
  const day = today.getDay();
  if (day >= 1 && day <= 4) return motorcycle.pricePerDayMonThu;
  else return motorcycle.pricePerDayFriSun;
};
