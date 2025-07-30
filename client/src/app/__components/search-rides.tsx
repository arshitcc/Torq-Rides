"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { format, isSameDay } from "date-fns";
import { MapPinIcon, CalendarIcon, ClockIcon, SearchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { SearchRidesFormData, searchRidesSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import TimePickerPopover from "./select-time";

const getInitialTimes = () => {
  const now = new Date();
  let pickupDate = new Date();
  pickupDate.setHours(0, 0, 0, 0);
  let pickupHour = now.getHours() + 1;

  if (pickupHour >= 21) {
    pickupHour = 9;
    pickupDate.setDate(pickupDate.getDate() + 1);
  }

  if (pickupHour < 9) {
    pickupHour = 9;
  }
  const pickupTime = `${String(pickupHour).padStart(2, "0")}:00`;

  // let dropoffHour = pickupHour + 4;
  // if (dropoffHour > 22) {
  //   dropoffHour = 22;
  // }
  // const dropoffTime = `${String(dropoffHour).padStart(2, "0")}:00`;

  // return {
  //   pickupDate,
  //   dropoffDate: new Date(pickupDate),
  //   pickupTime,
  //   dropoffTime,
  // };

  const dropoffDate = new Date(pickupDate);
  dropoffDate.setDate(dropoffDate.getDate() + 1);
  const dropoffTime = pickupTime;

  return {
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
  };
};

function SearchRides() {
  const {
    setPickupDate,
    setDropoffDate,
    setPickupTime,
    setDropoffTime,
    setPickupLocation,
    setDropoffLocation,
    pickupLocation,
  } = useCartStore();

  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

  const form = useForm<SearchRidesFormData>({
    resolver: zodResolver(searchRidesSchema),
    defaultValues: {
      pickupLocation: pickupLocation || "",
      dropoffLocation: pickupLocation || "",
      ...getInitialTimes(),
    },
  });

  const watchedPickupDate = form.watch("pickupDate");
  const watchedDropoffDate = form.watch("dropoffDate");
  const watchedPickupTime = form.watch("pickupTime");

  useEffect(() => {
    const { pickupDate, dropoffDate, pickupTime } = form.getValues();

    if (!pickupDate || !dropoffDate) {
      return;
    }
    const minDropoffDate = new Date(pickupDate);
    minDropoffDate.setDate(pickupDate.getDate() + 1);
    minDropoffDate.setHours(0, 0, 0, 0);

    const currentDropoffDate = new Date(dropoffDate);
    currentDropoffDate.setHours(0, 0, 0, 0);

    if (currentDropoffDate < minDropoffDate) {
        form.setValue("dropoffDate", minDropoffDate);
        return;
    }

    const dropoffTime = form.getValues("dropoffTime");
    if (!pickupTime || !dropoffTime) {
      return;
    }

    const nextDayAfterPickup = new Date(pickupDate);
    nextDayAfterPickup.setDate(pickupDate.getDate() + 1);

    if (isSameDay(dropoffDate, nextDayAfterPickup)) {
      const [pickupHour] = pickupTime.split(':').map(Number);
      const [dropoffHour] = dropoffTime.split(':').map(Number);

      if (dropoffHour < pickupHour) {
        form.setValue("dropoffTime", ""); 
      }
    }
  }, [watchedPickupDate, watchedDropoffDate, watchedPickupTime, form]);

  const { filters } = useMotorcycleStore();
  const branches = filters.distinctCities;
  const router = useRouter();

  const onSubmit = (data: SearchRidesFormData) => {
    setPickupDate(data.pickupDate);
    setDropoffDate(data.dropoffDate);
    setPickupTime(data.pickupTime);
    setDropoffTime(data.dropoffTime);
    setPickupLocation(data.pickupLocation || "");
    setDropoffLocation(data.pickupLocation || "");
    router.push(`/motorcycles?location=${data.pickupLocation}`);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="max-w-6xl mx-auto bg-white dark:bg-[#18181B] border-gray-200 dark:border-gray-700 shadow">
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Pickup Location */}
                  <FormField
                    name="pickupLocation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <MapPinIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Pick Up Location
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("dropoffLocation", value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                              <SelectValue placeholder="Select Pickup location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Pickup Date */}
                  <FormField
                    name="pickupDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <CalendarIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Pick Up Date
                        </FormLabel>
                        <Popover
                          open={pickupDateOpen}
                          onOpenChange={setPickupDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal border-yellow-primary/30 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value
                                  ? format(
                                      new Date(field.value),
                                      "MMM dd, yyyy"
                                    )
                                  : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                if (
                                  date &&
                                  form.getValues("dropoffDate") < date
                                ) {
                                  form.setValue("dropoffDate", date);
                                }
                                setPickupDateOpen(false);
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  {/* Pickup Time */}
                  <FormField
                    name="pickupTime"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <ClockIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Pick Up Time
                        </FormLabel>
                        <TimePickerPopover
                          field={field}
                          isOpen={pickupTimeOpen}
                          setIsOpen={setPickupTimeOpen}
                          placeholder="Select pickup time"
                          pickupDate={watchedPickupDate}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Drop Off Location */}
                  <FormField
                    name="dropoffLocation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <MapPinIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Drop Off Location
                        </FormLabel>
                        <Select value={field.value} disabled>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                              <SelectValue placeholder="Same as Pickup location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {/* Drop Off Date */}
                  <FormField
                    name="dropoffDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <CalendarIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Drop Off Date
                        </FormLabel>
                        <Popover
                          open={dropoffDateOpen}
                          onOpenChange={setDropoffDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal border-yellow-primary/30 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value
                                  ? format(
                                      new Date(field.value),
                                      "MMM dd, yyyy"
                                    )
                                  : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setDropoffDateOpen(false);
                              }}
                              disabled={(date) => date < watchedPickupDate}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  {/* Drop Off Time */}
                  <FormField
                    name="dropoffTime"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2 grid grid-rows-2">
                        <FormLabel className="dark:text-white">
                          <ClockIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Drop Off Time
                        </FormLabel>
                        <TimePickerPopover
                          field={field}
                          isOpen={dropoffTimeOpen}
                          setIsOpen={setDropoffTimeOpen}
                          placeholder="Select dropoff time"
                          isDropoff={true}
                          pickupDate={watchedPickupDate}
                          dropoffDate={watchedDropoffDate}
                          pickupTime={watchedPickupTime}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-yellow-primary cursor-pointer text-white px-12 py-4 text-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <SearchIcon className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
export default SearchRides;
