"use client";
import React from "react";
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
import { PopoverClose } from "@radix-ui/react-popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useState } from "react";
import { MapPinIcon, CalendarIcon, ClockIcon, SearchIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { SearchRidesFormData, searchRidesSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMotorcycleStore } from "@/store/motorcycle-store";

function SearchRides() {
  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = ["00", "15", "30", "45"];
  const PERIODS = ["AM", "PM"];

  const {
    setPickupDate,
    setDropoffDate,
    setPickupTime,
    setDropoffTime,
    setPickupLocation,
    setDropoffLocation,
    pickupLocation,
  } = useCartStore();

  const form = useForm<SearchRidesFormData>({
    resolver: zodResolver(searchRidesSchema),
    defaultValues: {
      pickupDate: new Date(),
      dropoffDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      pickupTime: "9:00 AM",
      dropoffTime: "6:00 PM",
      pickupLocation: pickupLocation || "",
      dropoffLocation: pickupLocation,
    },
  });

  const { filters } = useMotorcycleStore();
  const branches = filters.distinctCities;

  const router = useRouter();

  const onSubmit = (data: SearchRidesFormData) => {
    setPickupDate(data.pickupDate);
    setDropoffDate(data.dropoffDate);
    setPickupTime(data.pickupTime);
    setDropoffTime(data.dropoffTime);
    setPickupLocation(data?.pickupLocation || "");
    setDropoffLocation(data?.dropoffLocation || "");
    router.push(`/motorcycles?location=${data?.pickupLocation}`);
  };

  return (
    <div>
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="max-w-6xl mx-auto bg-white dark:bg-[#18181B] border border-gray-200 dark:border-gray-700 shadow">
            <CardContent className=" flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pickup Location */}
                <FormField
                  name="pickupLocation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-white">
                        <MapPinIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                        Pick Up Location
                      </FormLabel>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("dropoffLocation", value);
                        }}
                      >
                        <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                          <SelectValue placeholder="Select Pickup location" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                {/* Pickup Date */}
                <FormField
                  name="pickupDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-white">
                        <CalendarIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                        Pick Up Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal border-yellow-primary/30 ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(new Date(field.value), "MMM dd, yyyy")
                              ) : (
                                <>
                                  <CalendarIcon /> {"Select date"}
                                </>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
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
                  render={({ field }) => {
                    const [hour, setHour] = useState("9");
                    const [minute, setMinute] = useState("00");
                    const [period, setPeriod] = useState("AM");
                    const canSet = hour && minute && period;
                    const handleSet = () => {
                      if (!canSet) return;
                      if (
                        (Number(hour) > 10 && period === "PM") ||
                        (Number(hour) < 9 && period === "AM")
                      ) {
                        toast.error(
                          "Our Business hours are between 9:00 AM to 10:00 PM"
                        );
                        setHour("9");
                        setMinute("00");
                        setPeriod("AM");
                        return;
                      }
                      field.onChange(`${hour}:${minute} ${period}`);
                    };

                    return (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel className="dark:text-white">
                          <ClockIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Pick Up Time
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`pl-3 text-left font-normal border-yellow-primary/30 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  <span>{field.value}</span>
                                ) : (
                                  <span>Pick a time</span>
                                )}

                                <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-transparent"
                            align="start"
                          >
                            <Card className="border-yellow-primary/30">
                              <CardContent className="grid grid-cols-3 divide-x">
                                <ScrollArea className="h-40">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {HOURS.map((h) => {
                                      const hs = String(h);
                                      return (
                                        <button
                                          key={h}
                                          onClick={() => setHour(hs)}
                                          className={`cursor-pointer p-1 rounded-md text-center ${
                                            hour === hs
                                              ? "bg-yellow-primary text-white"
                                              : ""
                                          }`}
                                        >
                                          {hs}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </ScrollArea>
                                <ScrollArea className="h-40">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {MINUTES.map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setMinute(m)}
                                        className={`cursor-pointer p-1 rounded-md ${
                                          minute === m
                                            ? "bg-yellow-primary text-white"
                                            : ""
                                        }`}
                                      >
                                        {m}
                                      </button>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <ScrollArea className="my-auto">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {PERIODS.map((p) => (
                                      <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`cursor-pointer p-1 rounded-md ${
                                          period === p
                                            ? "bg-yellow-primary text-white"
                                            : ""
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </CardContent>
                              <CardFooter className="flex justify-center">
                                <PopoverClose asChild>
                                  <Button
                                    size="sm"
                                    disabled={!canSet}
                                    onClick={handleSet}
                                    className="bg-yellow-primary hover:bg-yellow-600 dark:text-white"
                                  >
                                    Set Time
                                  </Button>
                                </PopoverClose>
                              </CardFooter>
                            </Card>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Drop Off Location */}
                <FormField
                  name="dropoffLocation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-white">
                        <MapPinIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                        Drop Off Location
                      </FormLabel>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        disabled
                      >
                        <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                          <SelectValue placeholder="Same as Pickup location" />
                        </SelectTrigger>
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

                <FormField
                  name="dropoffDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-white">
                        <CalendarIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                        Drop Off Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal border-yellow-primary/30 ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(new Date(field.value), "MMM dd, yyyy")
                              ) : (
                                <>
                                  <CalendarIcon /> {"Select date"}
                                </>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const start = form.watch("pickupDate");
                              return date < (start || new Date());
                            }}
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
                  render={({ field }) => {
                    const [hour, setHour] = useState("6");
                    const [minute, setMinute] = useState("00");
                    const [period, setPeriod] = useState("PM");
                    const canSet = hour && minute && period;
                    const handleSet = () => {
                      if (!canSet) return;
                      if (
                        (Number(hour) > 10 && period === "PM") ||
                        (Number(hour) < 9 && period === "AM")
                      ) {
                        toast.error(
                          "Our Business hours are between 9:00 AM to 10:00 PM"
                        );
                        setHour("6");
                        setMinute("00");
                        setPeriod("PM");
                        return;
                      }
                      field.onChange(`${hour}:${minute} ${period}`);
                    };

                    return (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel className="dark:text-white">
                          <ClockIcon className="inline h-4 w-4 mr-1 text-yellow-primary" />
                          Drop Off Time
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`pl-3 text-left font-normal border-yellow-primary/30 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  <span>{field.value}</span>
                                ) : (
                                  <span>Pick a time</span>
                                )}

                                <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-transparent"
                            align="start"
                          >
                            <Card className="border-yellow-primary/30">
                              <CardContent className="grid grid-cols-3 divide-x">
                                <ScrollArea className="h-40">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {HOURS.map((h) => {
                                      const hs = String(h);
                                      return (
                                        <button
                                          key={h}
                                          onClick={() => setHour(hs)}
                                          className={`cursor-pointer p-1 rounded-md text-center ${
                                            hour === hs
                                              ? "bg-yellow-primary text-white"
                                              : ""
                                          }`}
                                        >
                                          {hs}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </ScrollArea>
                                <ScrollArea className="h-40">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {MINUTES.map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setMinute(m)}
                                        className={`cursor-pointer p-1 rounded-md ${
                                          minute === m
                                            ? "bg-yellow-primary text-white"
                                            : ""
                                        }`}
                                      >
                                        {m}
                                      </button>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <ScrollArea className="my-auto">
                                  <div className="flex flex-col p-2 space-y-1">
                                    {PERIODS.map((p) => (
                                      <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`cursor-pointer p-1 rounded-md ${
                                          period === p
                                            ? "bg-yellow-primary text-white"
                                            : ""
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </CardContent>
                              <CardFooter className="flex justify-center">
                                <PopoverClose asChild>
                                  <Button
                                    size="sm"
                                    disabled={!canSet}
                                    onClick={handleSet}
                                    className="bg-yellow-primary hover:bg-yellow-600 dark:text-white"
                                  >
                                    Set Time
                                  </Button>
                                </PopoverClose>
                              </CardFooter>
                            </Card>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    );
                  }}
                />
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
