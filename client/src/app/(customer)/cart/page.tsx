"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { differenceInDays } from "date-fns";
import { type CartItem, UserRolesEnum } from "@/types";
import Script from "next/script";
import EmptyCart from "./__components/empty";
import Loading from "./loading";
import SuccessfulPayment from "./__components/success-payment";
import ProcessingPayment from "./__components/processing-payment";
import CartItemContent from "./__components/cart-item-content";
import FailedPayment from "./__components/failed-payment";
import PaymentSummary from "./__components/payment-summary";
import { getBookingPeriod, getFormattedAmount } from "@/lib/utils";

// Payment processing states
export type PaymentState = "cart" | "processing" | "success" | "failed";

export interface BookingDetails {
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
    duration: string;
  }>;
}

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, getUserCart, removeMotorcycleFromCart, clearCart, loading } =
    useCartStore();

  const [paymentMethod, setPaymentMethod] = useState("partial");

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
    return (cart.discountedTotal - cart.securityDepositTotal) * 0.2; // 20% advance
  };

  const calculateItemBreakup = (item: CartItem) => {
    const {
      duration,
      weekdayCount,
      weekendCount,
      extraHours,
      lastDayTypeForExtraHours,
    } = getBookingPeriod(
      new Date(item.pickupDate),
      item.pickupTime,
      new Date(item.dropoffDate),
      item.dropoffTime
    );

    const weekdayRate = item.motorcycle.pricePerDayMonThu;
    const weekendRate = item.motorcycle.pricePerDayFriSun;
    const quantity = item.quantity;

    let calculatedRent = 0;
    calculatedRent += weekdayCount * weekdayRate;
    calculatedRent += weekendCount * weekendRate;

    let extraHoursCharges = 0;
    if (extraHours > 0) {
      const extraHourRate =
        lastDayTypeForExtraHours === "weekday" ? weekdayRate : weekendRate;
      if (extraHours <= 4) {
        extraHoursCharges = extraHourRate * 0.1;
      } else {
        extraHoursCharges = extraHourRate;
      }
      calculatedRent += extraHoursCharges;
    }

    const totalItemRent = calculatedRent * quantity;
    // Assuming discount logic is handled elsewhere and reflected in item.discountedRentAmount
    const totalDiscount = totalItemRent - item.discountedRentAmount;
    const totalTax = item.totalTax;
    const subtotal = item.discountedRentAmount + totalTax;
    const securityDepositPerBike = item.motorcycle.securityDeposit;
    const securityDepositTotal = securityDepositPerBike * quantity;
    const total = subtotal + securityDepositTotal;

    return {
      weekdayRate,
      weekendRate,
      weekdayCount,
      weekendCount,
      extraHours,
      extraHoursCharges,
      calculatedRent,
      quantity,
      totalItemRent,
      duration,
      subtotal,
      taxPercentage: item.taxPercentage,
      totalTax,
      totalDiscount,
      securityDepositPerBike,
      securityDepositTotal,
      total,
    };
  };

  const resetToCart = () => {
    setPaymentState("cart");
    setErrorMessage("");
    setBookingDetails(null);
  };

  // Payment Processing State
  if (paymentState === "processing") {
    return (
      <ProcessingPayment
        paymentMethod={paymentMethod}
        cart={cart}
        calculateAdvancePayment={calculateAdvancePayment}
      />
    );
  }

  // Payment Success State
  if (paymentState === "success" && bookingDetails) {
    return (
      <SuccessfulPayment
        bookingDetails={bookingDetails}
        paymentMethod={paymentMethod}
      />
    );
  }

  // Payment Failed State
  if (paymentState === "failed") {
    return (
      <FailedPayment errorMessage={errorMessage} resetToCart={resetToCart} />
    );
  }

  // Rest of the original cart component code remains the same...
  if (!user || user.role !== UserRolesEnum.CUSTOMER) {
    return null;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
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
                  <CartItemContent
                    item={item}
                    handleRemoveItem={handleRemoveItem}
                    calculateItemBreakup={calculateItemBreakup}
                  />
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
            <PaymentSummary
              paymentMethod={paymentMethod}
              cart={cart}
              loading={loading}
              setPaymentMethod={setPaymentMethod}
              calculateAdvancePayment={calculateAdvancePayment}
              setPaymentState={setPaymentState}
              setBookingDetails={setBookingDetails}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
