"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CheckCircleIcon,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import { AxiosError } from "axios";
import { UserRolesEnum } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MotorcycleDetailPage() {
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

  const { user, isAuthenticated } = useAuthStore();

  const router = useRouter();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const inCart = cart?.items.find((item) => item.motorcycleId === id);

  const cartForm = useForm<AddToCartFormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: 1,
      pickupTime: pickupTime || "9:00 AM",
      pickupDate: pickupDate || new Date(),
      dropoffTime: dropoffTime || "6:00 PM",
      dropoffDate: dropoffDate,
      pickupLocation: motorcycle?.availableInCities.find(
        (loc) => loc.branch === pickupLocation
      )?.branch,
      dropoffLocation: motorcycle?.availableInCities.find(
        (loc) => loc.branch === pickupLocation
      )?.branch,
    },
  });

  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = ["00", "15", "30", "45"];
  const PERIODS = ["AM", "PM"];

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

  const calculateTotalCost = () => {
    if (!motorcycle) {
      return 0;
    }
    const pickupDate = cartForm.watch("pickupDate");
    const dropoffDate = cartForm.watch("dropoffDate");
    const quantity = cartForm.watch("quantity");

    if (pickupDate && dropoffDate && quantity) {
      const days = differenceInDays(dropoffDate, pickupDate);
      return days >= 0 ? (days + 1) * motorcycle?.rentPerDay * quantity : 0;
    }
    return 0;
  };

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
                  {[motorcycle?.categories].map(
                    (category, i) =>
                      i < 2 && (
                        <Badge key={i} variant="secondary">
                          {category}
                        </Badge>
                      )
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
                  ₹{motorcycle?.rentPerDay}/day
                </div>
                <div className="flex flex-col sm:grid grid-cols-3 gap-4 text-sm dark:text-white">
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-col justify-between text-center">
                    <div className="dark:text-white">Deposit</div>
                    <div className="font-medium">
                      ₹ {motorcycle?.securityDeposit}
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-col justify-between text-center">
                    <div className="dark:text-white text-muted-foreground">
                      Trip Limit
                    </div>
                    <div className="font-medium">
                      {motorcycle?.kmsLimitPerDay} kms
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#18181B] border-2 p-4 rounded-xl flex flex-col justify-between text-center">
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
                  {Object.entries(motorcycle.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 border-l-0 sm:border-l border-primary-200 dark:border-primary-700"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium ">
                          {key[0].toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                      <span>
                        {value}{" "}
                        {key === "engine"
                          ? "cc"
                          : key === "power"
                          ? "bhp"
                          : key === "weight"
                          ? "kg"
                          : key === "seatHeight"
                          ? "mm"
                          : ""}
                      </span>
                    </div>
                  ))}
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
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
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
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-auto p-0"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  classNames={{
                                    months:
                                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                    month: "space-y-4",
                                    caption:
                                      "flex justify-center pt-1 relative items-center text-yellow-900",
                                    caption_label: "text-sm font-medium",
                                    nav_button:
                                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-yellow-600",
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse space-y-1 ",
                                    head_row: "flex",
                                    head_cell:
                                      "text-yellow-600 rounded-md w-9 font-normal text-[0.8rem]",
                                    row: "flex w-full mt-2 space-x-1",
                                    day: "h-9 w-9 font-normal aria-selected:opacity-100 hover:bg-yellow-50 rounded-md",
                                    day_selected:
                                      "bg-yellow-600 text-white hover:bg-yellow-700 focus:bg-yellow-600 focus:text-white",
                                    day_today: "bg-yellow-100 text-yellow-900",
                                    day_outside: "text-gray-400 opacity-50",
                                    day_disabled: "text-gray-400 opacity-50",
                                    day_range_middle:
                                      "aria-selected:bg-yellow-100 aria-selected:text-yellow-900",
                                    day_hidden: "invisible",
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="pickupTime"
                      control={cartForm.control}
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
                              Pick Up Time
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`pl-3 text-left justify-start font-normal border-yellow-primary/30 ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      <span>{field.value}</span>
                                    ) : (
                                      <span>Pick a time</span>
                                    )}
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

                    <FormField
                      control={cartForm.control}
                      name="dropoffDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drop Off Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
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
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-auto p-0"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    const start = cartForm.watch("pickupDate");
                                    return date < (start || new Date());
                                  }}
                                  classNames={{
                                    months:
                                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                    month: "space-y-4",
                                    caption:
                                      "flex justify-center pt-1 relative items-center text-yellow-900",
                                    caption_label: "text-sm font-medium",

                                    nav_button:
                                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-yellow-600",
                                    nav_button_previous:
                                      "absolute left-1 top-2",
                                    nav_button_next: "absolute right-1 top-2",
                                    table: "w-full border-collapse space-y-1 ",
                                    head_row: "flex",
                                    head_cell:
                                      "text-yellow-600 rounded-md w-9 font-normal text-[0.8rem]",
                                    row: "flex w-full mt-2 space-x-1",
                                    day: "h-9 w-9 font-normal aria-selected:opacity-100 hover:bg-yellow-50 rounded-md",
                                    day_selected:
                                      "bg-yellow-600 text-white hover:bg-yellow-700 focus:bg-yellow-600 focus:text-white",
                                    day_today: "bg-yellow-200 text-yellow-900",
                                    day_outside: "text-gray-400 opacity-50",
                                    day_disabled: "text-gray-400 opacity-50",
                                    day_range_middle:
                                      "aria-selected:bg-yellow-100 aria-selected:text-yellow-900",
                                    day_hidden: "invisible",
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="dropoffTime"
                      control={cartForm.control}
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
                              Drop Off Time
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`pl-3 text-left justify-start font-normal border-yellow-primary/30 ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      <span>{field.value}</span>
                                    ) : (
                                      <span>Pick a time</span>
                                    )}
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

                  {calculateTotalCost() > 0 && (
                    <div className="p-4 dark:bg-transparent border-2 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{calculateTotalCost()}
                        </span>
                      </div>
                      <p className="text-sm dark:text-whit mt-1">
                        {differenceInDays(
                          cartForm.watch("dropoffDate") || new Date(),
                          cartForm.watch("pickupDate") || new Date()
                        ) + 1}{" "}
                        days × {cartForm.watch("quantity")} bikes × ₹
                        {motorcycle?.rentPerDay}
                        /day
                      </p>
                    </div>
                  )}

                  <div className="w-full">
                    {!user ? (
                      <Link href="/login" className="block w-full">
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
