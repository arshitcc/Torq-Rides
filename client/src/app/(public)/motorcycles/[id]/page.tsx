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

export default function MotorcycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { motorcycle, loading, getMotorcycleById, error } =
    useMotorcycleStore();
  const { reviews, getAllReviewsOfMotorcycleById } = useReviewStore();

  const {
    cart,
    addOrUpdateMotorcycleToCart,
    loading: cartLoading,
  } = useCartStore();

  const { user, isAuthenticated } = useAuthStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const inCart = cart?.items.find((item) => item.motorcycleId === id);

  const cartForm = useForm<AddToCartFormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: inCart?.quantity || 1,
      pickupTime: inCart?.pickupTime || "9:00 AM",
      pickupDate: inCart?.pickupDate || new Date(),
      dropoffTime: inCart?.dropoffTime || "6:00 PM",
      dropoffDate: inCart?.dropoffDate,
    },
  });

  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = ["00", "15", "30", "45"];
  const PERIODS = ["AM", "PM"];

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (id) {
      getMotorcycleById(id.toString());
      getAllReviewsOfMotorcycleById(id.toString());
    }
  }, [id, user]);

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
    try {
      if (motorcycle?._id) {
        await addOrUpdateMotorcycleToCart(motorcycle._id, data);
        toast.success("Added to Cart!");
        cartForm.reset();
      }
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message || "Failed to add to cart.");
    }
  };

  if (!user) {
    return null;
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 md:h-160 overflow-hidden">
                <Image
                  src={
                    motorcycle?.images[selectedImageIndex]?.url ||
                    "/placeholder.svg"
                  }
                  alt={`${motorcycle?.make} ${motorcycle?.vehicleModel}`}
                  fill
                  className="object-fit transform transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-20" variant="secondary">
                  {motorcycle?.category}
                </Badge>
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {motorcycle?.year}
                </Badge>
              </div>
              {motorcycle && motorcycle.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {motorcycle.images.map((image, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`cursor-pointer relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
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
                          className="object-cover"
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
                <div className="flex flex-col sm:grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-100 p-4 rounded-xl flex flex-row justify-between">
                    <div className="text-muted-foreground">Deposit</div>
                    <div className="font-medium">
                      ₹ {motorcycle?.securityDeposit}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl flex flex-row justify-between">
                    <div className="text-muted-foreground">Trip Limit</div>
                    <div className="font-medium">
                      {motorcycle?.kmsLimitPerDay} kms
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl flex flex-row justify-between">
                    <div className="text-muted-foreground">Extra Km Charge</div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:first:border-l-0 sm:last:border-r-0">
                  {Object.entries(motorcycle.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 border-r-0 sm:border-r border-primary-200 dark:border-primary-700"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium ">
                          {key[0].toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                      <span>{value}</span>
                    </div>
                  ))}
                  <div
                    key={"seater"}
                    className="flex items-center justify-between p-2 border-primary-200 dark:border-primary-700"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium ">Seats</span>
                    </div>
                    <span className="font-bold">2 Seater</span>
                  </div>
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
                        {reviews[currentReviewIndex].customer.fullname}
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
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
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
                              max={motorcycle?.availableQuantity}
                              className="text-center"
                              {...field}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (
                                  !isNaN(val) &&
                                  val >= 0 &&
                                  val <= motorcycle?.availableQuantity!
                                )
                                  field.onChange(val);
                                else field.onChange(1);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="cursor-pointer"
                              size="icon"
                              onClick={() =>
                                field.onChange(
                                  Math.min(
                                    motorcycle?.availableQuantity ?? 0,
                                    field.value + 1
                                  )
                                )
                              }
                              disabled={
                                field.value >=
                                (motorcycle?.availableQuantity ?? 0)
                              }
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {calculateTotalCost() > 0 && (
                    <div className="p-4 dark:bg-transparent border-2 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{calculateTotalCost()}
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-600 mt-1">
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

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
