"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import {
  ArrowLeftIcon,
  StarIcon,
  Loader2Icon,
  CalendarIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays, isSameDay } from "date-fns";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useReviewStore } from "@/store/review-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import MotorcycleNotFound from "./__components/not-found";
import { AddToCartFormData, addToCartSchema } from "@/schemas/cart.schema";
import { useCartStore } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";
import { UserRolesEnum } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimePickerPopover from "@/app/__components/select-time";
import { getBookingPeriod, getTodayPrice } from "@/lib/utils";

export default function MotorcycleDetailPage() {
  const pathname = usePathname();
  const params = useParams();
  const { id } = params;

  const { motorcycle, loading, getMotorcycleById, error } =
    useMotorcycleStore();
  const { reviews, getAllReviewsOfMotorcycleById } = useReviewStore();

  const {
    cart,
    addOrUpdateMotorcycleToCart,
    loading: cartLoading,
    pickupTime,
    pickupDate,
    dropoffTime,
    dropoffDate,
    pickupLocation,
  } = useCartStore();

  const { user } = useAuthStore();

  const router = useRouter();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

  const inCart = cart?.items.find((item) => item.motorcycleId === id);

  const cartForm = useForm<AddToCartFormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: 1,
      pickupTime: pickupTime || "09:00",
      pickupDate: new Date(pickupDate) || new Date(),
      dropoffTime: dropoffTime || "18:00",
      dropoffDate:
        new Date(dropoffDate) || new Date(Date.now() + 24 * 60 * 60 * 1000),
      pickupLocation: motorcycle?.availableInCities.find(
        (loc) => loc.branch === pickupLocation
      )?.branch,
      dropoffLocation: motorcycle?.availableInCities.find(
        (loc) => loc.branch === pickupLocation
      )?.branch,
    },
  });

  const watchedPickupDate = cartForm.watch("pickupDate");
  const watchedDropoffDate = cartForm.watch("dropoffDate");
  const watchedPickupTime = cartForm.watch("pickupTime");
  const watchedDropoffTime = cartForm.watch("dropoffTime");
  const watchedQuantity = cartForm.watch("quantity");

  useEffect(() => {
    if (loading) return;
    if (id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      getMotorcycleById(id.toString());
      getAllReviewsOfMotorcycleById(id.toString());
    }
  }, [id]);

  useEffect(() => {
    if (!inCart) return;
    cartForm.reset({
      quantity: inCart.quantity,
      pickupTime: inCart.pickupTime,
      pickupDate: new Date(inCart.pickupDate),
      dropoffTime: inCart.dropoffTime,
      dropoffDate: new Date(inCart.dropoffDate),
      pickupLocation: inCart.pickupLocation,
      dropoffLocation: inCart.dropoffLocation,
    });
  }, [inCart, cartForm]);

  useEffect(() => {
    const { pickupDate, dropoffDate, pickupTime } = cartForm.getValues();

    if (!pickupDate || !dropoffDate) {
      return;
    }
    const minDropoffDate = new Date(pickupDate);
    minDropoffDate.setDate(pickupDate.getDate() + 1);
    minDropoffDate.setHours(0, 0, 0, 0);

    const currentDropoffDate = new Date(dropoffDate);
    currentDropoffDate.setHours(0, 0, 0, 0);

    if (currentDropoffDate < minDropoffDate) {
      cartForm.setValue("dropoffDate", minDropoffDate);
      return;
    }

    const dropoffTime = cartForm.getValues("dropoffTime");
    if (!pickupTime || !dropoffTime) {
      return;
    }

    const nextDayAfterPickup = new Date(pickupDate);
    nextDayAfterPickup.setDate(pickupDate.getDate() + 1);

    if (isSameDay(dropoffDate, nextDayAfterPickup)) {
      const [pickupHour] = pickupTime.split(":").map(Number);
      const [dropoffHour] = dropoffTime.split(":").map(Number);

      if (dropoffHour < pickupHour) {
        cartForm.setValue("dropoffTime", "");
      }
    }
  }, [watchedPickupDate, watchedDropoffDate, watchedPickupTime, cartForm]);

  const calculateTotalCost = () => {
    if (
      !motorcycle ||
      !watchedPickupDate ||
      !watchedDropoffDate ||
      !watchedPickupTime ||
      !watchedDropoffTime ||
      !watchedQuantity
    ) {
      return { totalCost: 0, duration: "N/A" };
    }

    const bookingPeriod = getBookingPeriod(
      watchedPickupDate,
      watchedPickupTime,
      watchedDropoffDate,
      watchedDropoffTime
    );

    if (bookingPeriod.totalHours <= 0) {
      return { totalCost: 0, duration: "0 days 0 hours" };
    }

    const { weekdayCount, weekendCount, extraHours, lastDayTypeForExtraHours } =
      bookingPeriod;

    let totalCost = 0;
    totalCost += weekdayCount * motorcycle.pricePerDayMonThu;
    totalCost += weekendCount * motorcycle.pricePerDayFriSun;

    if (extraHours > 0) {
      const extraHourRate =
        lastDayTypeForExtraHours === "weekday"
          ? motorcycle.pricePerDayMonThu
          : motorcycle.pricePerDayFriSun;
      if (extraHours <= 4) {
        totalCost += extraHourRate * 0.1; 
      } else {
        totalCost += extraHourRate;
      }
    }

    return {
      totalCost: totalCost * watchedQuantity,
      duration: bookingPeriod.duration,
    };
  };

  const { totalCost, duration } = calculateTotalCost();

  const onCartSubmit = async (data: AddToCartFormData) => {
    if (user?.role === UserRolesEnum.ADMIN) {
      toast.error("Admin's Cannot add to Cart !!");
      return;
    }

    try {
      if (motorcycle?._id) {
        await addOrUpdateMotorcycleToCart(motorcycle._id, data);
        toast.success("Added to Cart!");
        cartForm.reset();
        router.push("/cart");
      }
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message || "Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2Icon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <MotorcycleNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/motorcycles">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Motorcycles
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-0 group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-60 lg:h-100 overflow-hidden">
                <Image
                  src={
                    motorcycle?.images[selectedImageIndex]?.url ||
                    "/placeholder.svg"
                  }
                  alt={`${motorcycle?.make} ${motorcycle?.vehicleModel}`}
                  fill
                  className="object-fit transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 space-x-3">
                  <Badge className="text-xs bg-yellow-500 text-white">
                    {motorcycle?.categories[0]}
                  </Badge>
                  {motorcycle && motorcycle?.categories?.length > 1 && (
                    <Badge className="text-xs bg-yellow-500 text-white">
                      {motorcycle?.categories[1]}
                    </Badge>
                  )}
                </div>
              </div>
              {motorcycle && motorcycle?.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {motorcycle?.images.map((image, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`cursor-pointer bg-transparent dark:bg-transparent hover:bg-transparent relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index
                            ? "border-primary"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`${motorcycle.make} ${
                            motorcycle.vehicleModel
                          } view ${index + 1}`}
                          fill
                          className="object-fit"
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  *Images are for representation purposes only.
                </p>
              </div>

              <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-2">
                  {motorcycle?.make} {motorcycle?.vehicleModel}
                </h1>
                <p className="text-gray-600 mb-4">{motorcycle?.description}</p>
                <div className="text-3xl font-bold text-primary">
                  ₹{motorcycle && getTodayPrice(motorcycle)}/day
                </div>
                <div className="flex flex-col sm:grid grid-cols-2 gap-4 text-sm dark:text-white">
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-row md:flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Rental Price <span className="font-bold">(Monday - Thursday)</span>
                    </div>
                    <div className="font-medium">
                      ₹ {motorcycle?.pricePerDayMonThu} / day
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-row md:flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Rental Price <span className="font-bold">(Friday - Saturday)</span>
                    </div>
                    <div className="font-medium">
                      ₹ {motorcycle?.pricePerDayFriSun} / day
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:grid grid-cols-3 gap-4 text-sm dark:text-white">
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-row md:flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Deposit
                    </div>
                    <div className="font-medium">
                      ₹ {motorcycle?.securityDeposit}
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-row md:flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Trip Limit
                    </div>
                    <div className="font-medium">
                      {motorcycle?.kmsLimitPerDay} kms
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-row md:flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Extra Km Charge
                    </div>
                    <div className="font-medium">
                      ₹ {motorcycle?.extraKmsCharges} per km
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {motorcycle?.specs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                  {motorcycle.specs?.engine && (
                    <div className="flex items-center justify-between p-2 border-l-0 sm:border-l border-primary-200 dark:border-primary-700">
                      <div className="flex items-center space-x-2">
                        <Image
                          width="25"
                          height="25"
                          src="https://img.icons8.com/ios-filled/100/E7B005/engine.png"
                          alt="Engine"
                        />
                        <span className="font-medium">Engine</span>
                      </div>
                      <span className="text-muted-foreground">
                        {motorcycle.specs.engine} cc
                      </span>
                    </div>
                  )}
                  {motorcycle.specs?.power && (
                    <div className="flex items-center justify-between p-2 border-l-0 sm:border-l border-primary-200 dark:border-primary-700">
                      <div className="flex items-center space-x-2">
                        <Image
                          width="25"
                          height="25"
                          src="https://img.icons8.com/ios-filled/100/E7B005/electricity.png"
                          alt="Power"
                        />
                        <span className="font-medium ">Power</span>
                      </div>
                      <span className="text-muted-foreground">
                        {motorcycle.specs.power} ps
                      </span>
                    </div>
                  )}
                  {motorcycle.specs?.weight && (
                    <div className="flex items-center justify-between p-2 border-l-0 sm:border-l border-primary-200 dark:border-primary-700">
                      <div className="flex items-center space-x-2">
                        <Image
                          width="25"
                          height="25"
                          src="https://img.icons8.com/ink/100/E7B005/weight-kg.png"
                          alt="weight-kg"
                        />
                        <span className="font-medium ">Weight</span>
                      </div>
                      <span className="text-muted-foreground">
                        {motorcycle.specs.weight} kg
                      </span>
                    </div>
                  )}
                  {motorcycle.specs?.seatHeight && (
                    <div className="flex items-center justify-between p-2 border-l-0 sm:border-l border-primary-200 dark:border-primary-700">
                      <div className="flex items-center space-x-2">
                        <Image
                          width="25"
                          height="25"
                          src="https://img.icons8.com/ios-filled/100/E7B005/motorcycle.png"
                          alt="Seat Height"
                        />
                        <span className="font-medium ">Seat Height</span>
                      </div>
                      <span className="text-muted-foreground">
                        {motorcycle.specs.seatHeight} mm
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 lg:bg-gray/45 border-2 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviews[currentReviewIndex].rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">
                        {reviews[currentReviewIndex].customer?.fullname}
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {format(
                          reviews[currentReviewIndex].createdAt,
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {reviews[currentReviewIndex].comment}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentReviewIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentReviewIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Booking Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Book This Motorcycle</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...cartForm}>
                <form
                  onSubmit={cartForm.handleSubmit(onCartSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={cartForm.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Date</FormLabel>
                          <Popover
                            open={pickupDateOpen}
                            onOpenChange={setPickupDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "MMM dd, yyyy")
                                    : "Select date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  if (
                                    date &&
                                    cartForm.getValues("dropoffDate") < date
                                  ) {
                                    cartForm.setValue("dropoffDate", date);
                                  }
                                  setPickupDateOpen(false);
                                }}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="pickupTime"
                      control={cartForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pick Up Time</FormLabel>
                          <TimePickerPopover
                            field={field}
                            isOpen={pickupTimeOpen}
                            setIsOpen={setPickupTimeOpen}
                            placeholder="Select time"
                            pickupDate={watchedPickupDate}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cartForm.control}
                      name="dropoffDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drop Off Date</FormLabel>
                          <Popover
                            open={dropoffDateOpen}
                            onOpenChange={setDropoffDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "MMM dd, yyyy")
                                    : "Select date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="dropoffTime"
                      control={cartForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drop Off Time</FormLabel>
                          <TimePickerPopover
                            field={field}
                            isOpen={dropoffTimeOpen}
                            setIsOpen={setDropoffTimeOpen}
                            placeholder="Select time"
                            isDropoff={true}
                            pickupDate={watchedPickupDate}
                            dropoffDate={watchedDropoffDate}
                            pickupTime={watchedPickupTime}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cartForm.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Location</FormLabel>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              cartForm.setValue("pickupLocation", value);
                              cartForm.setValue("dropoffLocation", value);
                            }}
                          >
                            <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                              <SelectValue placeholder="Select Pickup location" />
                            </SelectTrigger>
                            <SelectContent>
                              {motorcycle?.availableInCities.map((loc) => (
                                <SelectItem key={loc.branch} value={loc.branch}>
                                  {loc.branch} ({loc.quantity} left)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cartForm.control}
                      name="dropoffLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dropoff Location</FormLabel>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              cartForm.setValue("dropoffLocation", value);
                            }}
                            disabled
                          >
                            <SelectTrigger className="w-full bg-white text-muted-foreground border-yellow-primary/30 focus:border-yellow-primary focus:ring-yellow-primary/20">
                              <SelectValue placeholder="Select Dropoff location" />
                            </SelectTrigger>
                            <SelectContent>
                              {motorcycle?.availableInCities.map((loc) => (
                                <SelectItem key={loc.branch} value={loc.branch}>
                                  {loc.branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  {cartForm.watch("pickupLocation") && (
                    <FormField
                      control={cartForm.control}
                      name="quantity"
                      render={({ field }) => {
                        const pickupBranch = cartForm.watch("pickupLocation");
                        const branchQty =
                          motorcycle?.availableInCities.find(
                            (loc) => loc.branch === pickupBranch
                          )?.quantity ?? 0;

                        return (
                          <FormItem>
                            <FormLabel>Quantity (Max: {branchQty})</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="cursor-pointer"
                                  size="icon"
                                  onClick={() =>
                                    field.onChange(Math.max(1, field.value - 1))
                                  }
                                  disabled={field.value <= 1}
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <Input
                                  min="1"
                                  max={branchQty}
                                  className="text-center"
                                  {...field}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (
                                      !isNaN(val) &&
                                      val >= 1 &&
                                      val <= branchQty
                                    )
                                      field.onChange(val);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="cursor-pointer"
                                  size="icon"
                                  onClick={() =>
                                    field.onChange(
                                      Math.min(branchQty, field.value + 1)
                                    )
                                  }
                                  disabled={field.value >= branchQty}
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  {totalCost > 0 && (
                    <div className="p-4 dark:bg-transparent border-2 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{totalCost.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm dark:text-whit mt-1">
                        Duration: {duration} {watchedQuantity>1 && `(${watchedQuantity} motorcycles)`}
                      </p>
                    </div>
                  )}

                  <div className="w-full">
                    {!user ? (
                      <Link
                        href={`/login?redirectUrl=${pathname}`}
                        className="block w-full"
                      >
                        <Button className="w-full cursor-pointer bg-yellow-primary hover:bg-yellow-600 dark:text-white">
                          <User2Icon />
                          Login to Add to Cart
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full cursor-pointer bg-yellow-primary hover:bg-yellow-600 dark:text-white"
                        size="lg"
                        disabled={cartLoading}
                      >
                        {cartLoading ? (
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCartIcon className="mr-2 h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
