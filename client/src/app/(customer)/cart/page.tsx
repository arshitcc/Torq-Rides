"use client";

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
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Building,
  Loader2Icon,
  TagIcon,
  CheckCircleIcon,
  XIcon,
  EyeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { CartItem, UserRolesEnum } from "@/types";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("partial");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showBreakup, setShowBreakup] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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
    getUserCart();
  }, [user, router, toast, getUserCart]);

  const handleRemoveItem = async (motorcycleId: string) => {
    try {
      await removeMotorcycleFromCart(motorcycleId);
      toast.success("Item removed from cart !!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to remove item from cart !!");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart Cleared");
    } catch (error: AxiosError | any) {
      toast.error("Failed to clear cart.");
    }
  };

  const calculateAdvancePayment = () => {
    if (!cart) return 0;
    const totalRent = cart.rentTotal;
    return Math.round(totalRent * 0.2); // 20% advance
  };

  const calculateItemBreakup = (item: CartItem) => {
    const days =
      differenceInDays(new Date(item.returnDate), new Date(item.pickupDate)) +
      1;
    const dailyRate = item.motorcycle.rentPerDay;
    const quantity = item.quantity;
    const subtotal = days * dailyRate * quantity;
    const securityDeposit = item.motorcycle.securityDeposit * quantity;

    return {
      days,
      dailyRate,
      quantity,
      subtotal,
      securityDeposit,
      total: subtotal + securityDeposit,
    };
  };

  const handlePayment = () => {
    if (!agreeToTerms) {
      toast.warning("Please agree to our terms and conditions");
      return;
    }

    // Simulate payment processing
    toast.success("Payment Processing", {
      description: "Redirecting to payment gateway...",
    });

    // Here you would integrate with actual payment gateway
    setTimeout(() => {
      toast.success("Booking Confirmed!");
      router.push("/my-bookings");
    }, 2000);
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
          <ShoppingCart className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-gray-600">
            Add some motorcycles to your cart to get started.
          </p>
          <Button
            asChild
            className="bg-yellow-primary hover:bg-yellow-600 text-black"
          >
            <Link href="/motorcycles">Browse Motorcycles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/motorcycles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold ml-4">
            Cart ({cart?.items?.length})
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 bg-transparent"
        >
          <Trash2 className="w-4 h-4 mr-2" />
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
                className="overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Motorcycle Image */}
                    <div className="relative w-full md:w-64 h-48">
                      <Image
                        src={item.motorcycle.image?.url || "/placeholder.svg"}
                        alt={`${item.motorcycle.make} ${item.motorcycle.vehicleModel}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Motorcycle Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.motorcycle.make}{" "}
                            {item.motorcycle.vehicleModel}
                          </h3>
                          <Badge variant="secondary" className="mt-1">
                            {item.motorcycle.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.motorcycleId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Trip Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Pickup Date</p>
                          <p className="font-medium">
                            {format(new Date(item.pickupDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">03:00 PM</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Return Date</p>
                          <p className="font-medium">
                            {format(new Date(item.returnDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">03:00 PM</p>
                        </div>
                      </div>

                      {/* Trip Includes */}
                      <div className="mb-4">
                        <p className="font-medium mb-2">Your Trip Includes</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Original DL must be shown at pickup.</li>
                          <li>
                            • One original ID proof will be submitted at pickup.
                          </li>
                          <li>• 100 Free Kms, Fuel Excluded.</li>
                          <li>• Extra Kms at ₹5/Km.</li>
                          <li>
                            • ₹2000 deposit will be refunded within 2 days after
                            drop-off.
                          </li>
                          <li>• Only local trip allowed</li>
                        </ul>
                      </div>

                      {/* Pricing */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Total Rent</p>
                            <p className="font-semibold">
                              ₹{item.motorcycle.rentPerDay * item.quantity}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              Security Deposit
                            </p>
                            <p className="font-semibold">
                              ₹{item.motorcycle.securityDeposit * item.quantity}
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
                                    const breakup = calculateItemBreakup(item);
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
                                        <div className="flex justify-between">
                                          <span>Security Deposit:</span>
                                          <span>
                                            ₹{breakup.securityDeposit}
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
                  <Plus className="w-4 h-4 mr-2" />
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
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={() => setAgreeToTerms((prev) => !prev)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the RentHop's{" "}
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
                <div className="flex justify-center items-center space-x-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                  <Smartphone className="w-8 h-8 text-gray-400" />
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex justify-center space-x-8 text-xs text-gray-500 mt-2">
                  <span>VISA</span>
                  <span>UPI</span>
                  <span>RuPay</span>
                  <span>Mastercard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
