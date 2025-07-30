"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ClockIcon } from "lucide-react";
import { useMemo } from "react";
import { isToday, isSameDay } from "date-fns";

const BUSINESS_HOURS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const TimePickerPopover = ({
  field,
  isOpen,
  setIsOpen,
  placeholder = "Select time",
  pickupDate,
  dropoffDate,
  pickupTime,
  isDropoff = false,
}: {
  field: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
  pickupDate?: Date;
  dropoffDate?: Date;
  pickupTime?: string;
  isDropoff?: boolean;
}) => {
  const handleTimeSelect = (time: string) => {
    field.onChange(time);
    setIsOpen(false);
  };

  // Memoize the calculation of available time slots
  const availableTimes = useMemo(() => {
    // let times = [...BUSINESS_HOURS];
    // const now = new Date();
    // const currentHour = now.getHours();

    // Logic for Pickup Time Picker
    // if (!isDropoff && pickupDate && isToday(pickupDate)) {
    //   // Filter out past hours for today's date
    //   times = times.filter((time) => {
    //     const [hour] = time.split(":").map(Number);
    //     return hour > currentHour;
    //   });
    // }

    // Logic for Dropoff Time Picker
    // if (isDropoff && pickupDate && dropoffDate && pickupTime) {
    //   // If pickup and dropoff are on the same day, enforce a 4-hour minimum duration
    //   if (isSameDay(pickupDate, dropoffDate)) {
    //     const [pickupHour] = pickupTime.split(":").map(Number);
    //     const minDropoffHour = pickupHour + 4;
    //     times = times.filter((time) => {
    //       const [dropoffHour] = time.split(":").map(Number);
    //       return dropoffHour >= minDropoffHour;
    //     });
    //   }
    // }

    // return times;
    const now = new Date();
    const currentHour = now.getHours();

    // --- Logic for Pickup Time Picker ---
    if (!isDropoff) {
      if (pickupDate && isToday(pickupDate)) {
        // For today, show times from the next hour, but not before 9 AM.
        const startHour = Math.max(9, currentHour + 1);
        return BUSINESS_HOURS.filter(time => {
            const [hour] = time.split(':').map(Number);
            return hour >= startHour;
        });
      }
      // For any future pickup date, all business hours are available.
      return BUSINESS_HOURS;
    }

    // --- Logic for Dropoff Time Picker ---
    if (isDropoff && pickupDate && dropoffDate && pickupTime) {
        const nextDayAfterPickup = new Date(pickupDate);
        nextDayAfterPickup.setDate(pickupDate.getDate() + 1);

        // If dropoff is the day right after pickup, enforce time to ensure a 24h minimum rental.
        if (isSameDay(dropoffDate, nextDayAfterPickup)) {
            const [pickupHour] = pickupTime.split(':').map(Number);
            return BUSINESS_HOURS.filter(time => {
                const [dropoffHour] = time.split(':').map(Number);
                return dropoffHour >= pickupHour;
            });
        }
        // For dropoff dates more than one day after pickup, all business hours are available.
        return BUSINESS_HOURS;
    }

    // Default case: return all business hours if props aren't ready
    return BUSINESS_HOURS;
  }, [pickupDate, dropoffDate, pickupTime, isDropoff]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal border-yellow-primary/30 focus:border-yellow-primary ${
              !field.value && "text-muted-foreground"
            }`}
          >
            {field.value ? (
              <span>{field.value}</span>
            ) : (
              <span>{placeholder}</span>
            )}
            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-0 bg-transparent rounded-xl"
        align="start"
      >
        <Card>
          <CardContent className="p-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-center">Select Time</h4>
              <p className="text-xs text-muted-foreground text-center">
                Business hours: 9:00 - 21:00
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-xs">
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={field.value === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className={`h-8 text-xs ${
                      field.value === time
                        ? "bg-yellow-primary hover:bg-yellow-600 text-white"
                        : "hover:bg-yellow-primary/10 hover:border-yellow-primary/50"
                    }`}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="col-span-4 text-center text-sm text-muted-foreground p-2 w-full">
                  No available slots. Please select another date.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default TimePickerPopover;
