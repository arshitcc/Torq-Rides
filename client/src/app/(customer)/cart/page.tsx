"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import {
  ArrowLeftIcon,
  PlusIcon,
  Trash2Icon,
  ShoppingCartIcon,
  Loader2Icon,
  TagIcon,
  CheckCircleIcon,
  XIcon,
  EyeIcon,
  CreditCardIcon,
  SmartphoneIcon,
  BuildingIcon,
  BitcoinIcon,
  CheckCircle2Icon,
  XCircleIcon,
  HomeIcon,
  ArrowRightIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { type CartItem, UserRolesEnum } from "@/types";
import type { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBookingStore } from "@/store/booking-store";
import Script from "next/script";

// Payment processing states
type PaymentState = "cart" | "processing" | "success" | "failed";

interface BookingDetails {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  motorcycles: Array<{
    make: string;
    model: string;
    quantity: number;
    pickupDate: Date;
    dropoffDate: Date;
    pickupLocation: string;
    dropoffLocation: string;
  }>;
}

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    cart,
    getUserCart,
    removeMotorcycleFromCart,
    clearCart,
    loading,
    applyCoupon,
    removeCouponFromCart,
    setCart,
  } = useCartStore();

  const { generateRazorpayOrder, verifyRazorpayPayment } = useBookingStore();
  const [paymentMethod, setPaymentMethod] = useState("partial");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Payment processing states
  const [paymentState, setPaymentState] = useState<PaymentState>("cart");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.CUSTOMER) {
      toast.info("Only customers can access the cart.");
      router.push("/");
      return;
    }

    // Fetch user's cart
    window.scrollTo({ top: 0, behavior: "smooth" });
    getUserCart();
  }, [user, router, getUserCart, isAuthenticated]);

  const handleRemoveItem = async (motorcycleId: string) => {
    try {
      await removeMotorcycleFromCart(motorcycleId);
      toast.success("Item removed from cart !!");
    } catch (error) {
      toast.error("Failed to remove item from cart !!");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart Cleared");
    } catch (error) {
      toast.error("Failed to clear cart.");
    }
  };

  const calculateAdvancePayment = () => {
    if (!cart) return 0;
    return cart.rentTotal * 0.2; // 20% advance
  };

  const calculateItemBreakup = (item: CartItem) => {
    const days =
      differenceInDays(new Date(item.dropoffDate), new Date(item.pickupDate)) +
      1;
    const dailyRate = item.motorcycle.rentPerDay;
    const quantity = item.quantity;
    const subtotal = days * dailyRate * quantity;
    const securityDepositPerBike = item.motorcycle.securityDeposit;
    const securityDepositTotal = item.motorcycle.securityDeposit * quantity;

    return {
      days,
      dailyRate,
      quantity,
      subtotal,
      securityDepositPerBike,
      securityDepositTotal,
      total: subtotal + securityDepositTotal,
    };
  };

  const handlePayment = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!cart || !user) return;
      if (!agreeToTerms) {
        toast.warning("Please agree to our terms and conditions");
        return;
      }

      // Set processing state
      setPaymentState("processing");
      window.scrollTo({ top: 0, behavior: "smooth" });

      const amount =
        paymentMethod === "partial"
          ? calculateAdvancePayment()
          : cart?.discountedTotal;

      const order = (await generateRazorpayOrder(
        paymentMethod === "partial" ? "p" : "f"
      )) as unknown as {
        id: string;
      };

      const options = {
        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_s0pNt1htM7MoYI",
        amount: amount * 100,
        currency: "INR",
        name: "TORQ Rides",
        description: "Motorcycle Rental Booking",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;
            const data = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              amount,
            };

            const paymentResponse = await verifyRazorpayPayment(data);
            if (paymentResponse) {
              // Set booking details for success screen
              setBookingDetails({
                bookingId: paymentResponse._id || `BK${Date.now()}`,
                amount: amount,
                paymentMethod:
                  paymentMethod === "partial"
                    ? "Partial Payment"
                    : "Full Payment",
                motorcycles: cart.items.map((item) => ({
                  make: item.motorcycle.make,
                  model: item.motorcycle.vehicleModel,
                  pickupDate: item.pickupDate,
                  dropoffDate: item.dropoffDate,
                  quantity: item.quantity,
                  pickupLocation: item.pickupLocation,
                  dropoffLocation: item.dropoffLocation,
                })),
              });

              setCart(null);
              setPaymentState("success");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            setErrorMessage(error?.message || "Payment verification failed");
            setPaymentState("failed");
          }
        },
        prefill: {
          name: user?.fullname,
          email: user?.email,
        },
        theme: { color: "#F59E0B" },
        modal: {
          ondismiss: () => {
            setPaymentState("cart");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        setErrorMessage(response.error.description || "Payment failed");
        setPaymentState("failed");
      });
      razorpay.open();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to process payment."
      );
      setPaymentState("failed");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode?.trim()) {
      toast.warning("Please enter a Valid coupon code!!");
      return;
    }

    setApplyingCoupon(true);
    try {
      await applyCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message || "Invalid Coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCouponFromCart();
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message || "Failed to remove coupon.");
    }
  };

  const resetToCart = () => {
    setPaymentState("cart");
    setErrorMessage("");
    setBookingDetails(null);
  };

  // Payment Processing State
  if (paymentState === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="relative">
                <Loader2Icon className="h-16 w-16 text-primary mx-auto animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCardIcon className="h-8 w-8 text-primary/60" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we process your payment. Do not close this
                  window.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-semibold">
                    ₹
                    {paymentMethod === "partial"
                      ? calculateAdvancePayment()
                      : cart?.discountedTotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Type:</span>
                  <span className="font-semibold">
                    {paymentMethod === "partial"
                      ? "Partial Payment"
                      : "Full Payment"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment Success State
  if (paymentState === "success" && bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <CheckCircle2Icon className="h-20 w-20 text-green-500 mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Your motorcycle rental has been successfully booked. You'll
                  receive a confirmation email shortly.
                </p>
              </div>

              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col justify-between items-center">
                      <span className="font-medium">Booking ID:</span>
                      <span className="font-bold text-green-600">
                        #{bookingDetails.bookingId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount Paid:</span>
                      <span className="font-bold">
                        ₹{bookingDetails.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Payment Type:</span>
                      <span className="font-bold">
                        {bookingDetails.paymentMethod}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Booked Motorcycles</h3>
                <div className="space-y-3">
                  {bookingDetails.motorcycles.map((motorcycle, index) => (
                    <Card key={index} className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {motorcycle.make} {motorcycle.model}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {differenceInDays(
                                motorcycle.dropoffDate,
                                motorcycle.pickupDate
                              )}
                            </p>
                          </div>
                          <Badge variant="secondary">Confirmed</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {paymentMethod === "partial" && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                          Remaining Payment Required
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Please pay the remaining amount of at the time of
                          pickup.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-yellow-primary text-white hover:bg-primary/90"
                >
                  <Link href="/my-bookings">
                    View My Bookings
                    <ArrowRightIcon />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/motorcycles">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Continue Browsing
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment Failed State
  if (paymentState === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <XCircleIcon className="h-20 w-20 text-red-500 mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                    <XIcon className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Payment Failed
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We couldn't process your payment. Please try again or use a
                  different payment method.
                </p>
                {errorMessage && (
                  <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {errorMessage}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetToCart}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/motorcycles">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Continue Browsing
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Need help? Contact our support team</p>
                <p className="font-medium">support@torqrides.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rest of the original cart component code remains the same...
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-gray-600">
            Add some motorcycles to your cart to get started.
          </p>
          <Button
            asChild
            className="bg-yellow-primary hover:bg-yellow-600 dark:text-white"
          >
            <Link href="/motorcycles">Browse Motorcycles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div>
          <Button asChild variant="ghost">
            <Link href="/motorcycles">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold ml-4">
              Cart ({cart?.items?.length})
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2Icon className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart?.items?.length > 0 &&
              cart.items.map((item, index) => (
                <Card
                  key={`${item.motorcycleId}-${index}`}
                  className="overflow-hidden py-0 gap-0 pt-0"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center gap-2 px-0 md:px-2">
                      {/* Motorcycle Image */}
                      <div className="relative w-full md:w-64 h-64">
                        <Link href={`/motorcycles/${item.motorcycleId}`}>
                          <Image
                            src={
                              item.motorcycle?.images[0]?.url ||
                              "/placeholder.svg"
                            }
                            alt={`${item.motorcycle.make} ${item.motorcycle.vehicleModel}`}
                            fill
                            className="object-fit rounded-none rounded-t-xl  sm:rounded-xl"
                          />
                        </Link>
                      </div>

                      {/* Motorcycle Details */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-4">
                          <Link href={`/motorcycles/${item.motorcycleId}`}>
                            <h3 className="text-xl font-bold">
                              {item.motorcycle.make}{" "}
                              {item.motorcycle.vehicleModel}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              {item.motorcycle.categories[0]}
                            </Badge>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.motorcycleId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Pickup Date</p>
                            <p className="font-medium">
                              {format(
                                new Date(item.pickupDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.pickupTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Drop Off Date
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(item.dropoffDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.dropoffTime}
                            </p>
                          </div>
                        </div>

                        {/* Trip Includes */}
                        <div className="mb-4">
                          <p className="font-medium mb-2">Your Trip Includes</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Original DL must be shown at pickup.</li>
                            <li>
                              • One original ID proof will be submitted at
                              pickup.
                            </li>
                            <li>• 100 Free Kms, Fuel Excluded.</li>
                            <li>• Extra Kms at ₹5/Km.</li>
                            <li>
                              • ₹2000 deposit will be refunded within 2 days
                              after drop-off.
                            </li>
                            <li>• Only local trip allowed</li>
                          </ul>
                        </div>

                        {/* Pricing */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center space-x-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">
                                Total Rent
                              </p>
                              <p className="font-semibold">
                                ₹{item.motorcycle.rentPerDay * item.quantity}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">
                                Security Deposit
                              </p>
                              <p className="font-semibold">
                                ₹
                                {item.motorcycle.securityDeposit *
                                  item.quantity}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Quantity</p>
                              <p className="font-semibold">{item.quantity}</p>
                            </div>
                            {/* Price Breakup Dialog */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-yellow-primary"
                                >
                                  <EyeIcon className="w-4 h-4 mr-1" />
                                  Show Breakup
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Price Breakup</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="text-sm">
                                    <h4 className="font-semibold mb-2">
                                      {item.motorcycle.make}{" "}
                                      {item.motorcycle.vehicleModel}
                                    </h4>
                                    {(() => {
                                      const breakup =
                                        calculateItemBreakup(item);
                                      return (
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span>Daily Rate:</span>
                                            <span>₹{breakup.dailyRate}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Number of Days:</span>
                                            <span>{breakup.days}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Quantity:</span>
                                            <span>{breakup.quantity}</span>
                                          </div>
                                          <Separator />
                                          <div className="flex justify-between">
                                            <span>Subtotal Rent:</span>
                                            <span>₹{breakup.subtotal}</span>
                                          </div>
                                          <Separator />
                                          <div className="flex justify-between">
                                            <span>
                                              Security Deposit per Bike:
                                            </span>
                                            <span>
                                              ₹{breakup.securityDepositPerBike}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Quantity:</span>
                                            <span>{breakup.quantity}</span>
                                          </div>
                                          <Separator />
                                          <div className="flex justify-between">
                                            <span>Security Deposit Total:</span>
                                            <span>
                                              ₹{breakup.securityDepositTotal}
                                            </span>
                                          </div>
                                          <Separator />
                                          <div className="flex justify-between font-bold">
                                            <span>Total:</span>
                                            <span>₹{breakup.total}</span>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Add Another Vehicle */}
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 text-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-yellow-primary text-yellow-primary hover:bg-yellow-50 bg-transparent"
                >
                  <Link href="/motorcycles">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Another Vehicle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Apply Coupon</h4>
                  {cart.coupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">
                            {cart.coupon.promoCode}
                          </p>
                          <p className="text-xs text-green-600">
                            {cart.coupon.type === "FLAT"
                              ? `₹${cart.coupon.discountValue} off`
                              : `${cart.coupon.discountValue}% off`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        disabled={loading}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          className="pr-10"
                          disabled={applyingCoupon}
                        />
                        <TagIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="bg-yellow-primary hover:bg-yellow-600 text-black"
                      >
                        {applyingCoupon ? (
                          <Loader2Icon className="w-4 h-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />
                {/* Total Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Rent</span>
                    <span className="font-semibold">₹{cart.rentTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Security Deposit</span>
                    <span className="font-semibold">
                      ₹{cart.securityDepositTotal}
                    </span>
                  </div>
                  {cart?.couponId?.toString().length > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-semibold text-red-500">
                        - ₹{cart.cartTotal - cart.discountedTotal}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span>₹{cart.discountedTotal}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium mb-3">Select Payment Method</h4>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="flex-1">
                        <div>
                          <p className="font-medium">Partial Payment</p>
                          <p className="text-sm text-gray-500">
                            Pay ₹{calculateAdvancePayment()} now (Advance 20% of
                            rent)
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="flex-1">
                        <div>
                          <p className="font-medium">Full Payment</p>
                          <p className="text-sm text-gray-500">
                            Pay full amount ₹{cart.discountedTotal}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount to Pay */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium dark:text-black">
                      Amount to Pay
                    </span>
                    <span className="text-2xl font-bold text-yellow-600">
                      ₹
                      {paymentMethod === "partial"
                        ? calculateAdvancePayment()
                        : cart.discountedTotal}
                    </span>
                  </div>
                  {paymentMethod === "partial" && (
                    <p className="text-sm text-gray-600 mt-1">
                      Pay remaining Rent + Deposit (₹
                      {cart.discountedTotal - calculateAdvancePayment()}) at the
                      time of pickup
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={() => setAgreeToTerms((prev) => !prev)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the TORQ Rides's{" "}
                    <Link
                      href="/terms"
                      className="text-yellow-600 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </Label>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full bg-yellow-primary hover:bg-yellow-600 text-black font-semibold py-3"
                  disabled={!agreeToTerms || loading}
                >
                  Pay ₹
                  {paymentMethod === "partial"
                    ? calculateAdvancePayment()
                    : cart.cartTotal}{" "}
                  and Reserve
                </Button>

                {/* Payment Methods */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 text-center">
                    100% Secure Payment By
                  </h4>
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3 text-center">
                      Accepted Payment Methods
                    </h4>
                    <div className="flex justify-around text-xs text-gray-500 mt-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <CreditCardIcon className="w-8 h-8 text-gray-400" />
                        <span>Cards</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <SmartphoneIcon className="w-8 h-8 text-gray-400" />
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
