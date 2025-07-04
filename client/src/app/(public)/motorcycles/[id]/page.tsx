"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  CreditCardIcon,
  SmartphoneIcon,
  BuildingIcon,
  BitcoinIcon,
  Loader2Icon,
  CalendarIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { UserRolesEnum } from "@/types";
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
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const cartForm = useForm<AddToCartFormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: 1,
    },
  });

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
    const returnDate = cartForm.watch("returnDate");
    const quantity = cartForm.watch("quantity");

    if (pickupDate && returnDate && quantity) {
      const days = differenceInDays(returnDate, pickupDate);
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
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  if (!user || user.role !== UserRolesEnum.CUSTOMER) {
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
              <div className="relative h-80 md:h-120 overflow-hidden">
                <Image
                  src={motorcycle?.image?.url || "/placeholder.svg"}
                  alt={`${motorcycle?.make} ${motorcycle?.vehicleModel}`}
                  fill
                  className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {motorcycle?.category}
                </Badge>
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {motorcycle?.make} {motorcycle?.vehicleModel}
                </h1>
                <p className="text-gray-600 mb-4">{motorcycle?.description}</p>
                <div className="text-3xl font-bold text-primary">
                  ₹{motorcycle?.rentPerDay}/day
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(motorcycle.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2 border-b border-primary-200 dark:border-primary-700"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5" />
                        <span className="font-medium ">
                          {key[0].toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                      <span className="">{value}</span>
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
                                className="w-full justify-start"
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
                    control={cartForm.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
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
                              type="number"
                              min="1"
                              max={motorcycle?.availableQuantity}
                              className="text-center"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 1
                                )
                              }
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
                          cartForm.watch("returnDate") || new Date(),
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
                      "Adding..."
                    ) : (
                      <>
                        <ShoppingCartIcon className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Payment Methods unchanged */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Accepted Payment Methods</h4>
                <div className="flex justify-around text-xs text-gray-500 mt-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <CreditCardIcon className="w-8 h-8 text-gray-400" />
                    <span>Cards</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    {" "}
                    <SmartphoneIcon className="w-8 h-8 text-gray-400" />{" "}
                    <span>UPI</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <BuildingIcon className="w-8 h-8 text-gray-400" />
                    <span>Net Banking</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <BitcoinIcon className="w-8 h-8 text-gray-400" />
                    <span>Crypto</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
