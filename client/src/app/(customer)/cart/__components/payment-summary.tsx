import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { useBookingStore } from "@/store/booking-store";
import { useCartStore } from "@/store/cart-store";
import { Cart } from "@/types";
import { AxiosError } from "axios";
import {
  BitcoinIcon,
  BuildingIcon,
  CheckCircleIcon,
  CreditCardIcon,
  Loader2Icon,
  SmartphoneIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BookingDetails, PaymentState } from "../page";
import { CancellationPolicyDialog } from "./cancellation-policy-dialog";
import Image from "next/image";
import { getFormattedAmount } from "@/lib/utils";

export interface PaymentSummaryProps {
  paymentMethod: string;
  cart: Cart;
  loading: boolean;
  calculateAdvancePayment: () => number;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentState>>;
  setBookingDetails: React.Dispatch<
    React.SetStateAction<BookingDetails | null>
  >;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function PaymentSummary({
  cart,
  loading,
  calculateAdvancePayment,
  paymentMethod,
  setPaymentMethod,
  setPaymentState,
  setBookingDetails,
  setErrorMessage,
}: PaymentSummaryProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { generateRazorpayOrder, verifyRazorpayPayment } = useBookingStore();

  const { user } = useAuthStore();
  const { applyCoupon, removeCouponFromCart, setCart, error, setError } =
    useCartStore();

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
          ? getFormattedAmount(calculateAdvancePayment())
          : cart?.discountedTotal;

      const order = (await generateRazorpayOrder(
        paymentMethod === "partial" ? "p" : "f"
      )) as unknown as {
        id: string;
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
                  duration: item.duration,
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

    setError(null);
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

  return (
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
            <div className="space-y-2">
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
                  className="bg-yellow-primary hover:bg-yellow-600 text-white"
                >
                  {applyingCoupon ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              <div>
                {error && (
                  <p className="text-red-500 bg-red-50 rounded-xl p-2 ">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />
        {/* Total Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Rent</span>
            <span className="font-semibold">
              ₹{getFormattedAmount(cart.rentTotal)}
            </span>
          </div>

          {cart?.couponId?.toString().length > 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="font-semibold text-red-500">
                - ₹{getFormattedAmount(cart.cartTotal - cart.discountedTotal)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Total Tax</span>
            <span className="font-semibold">
              ₹{getFormattedAmount(cart.totalTax)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span>Final Rent</span>
            <span className="font-semibold">
              ₹
              {getFormattedAmount(
                cart.discountedTotal - cart.securityDepositTotal
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total Security Deposit</span>
            <span className="font-semibold">₹{cart.securityDepositTotal}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>₹{getFormattedAmount(cart.discountedTotal)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="font-medium mb-3">Select Payment Method</h4>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id="partial" />
              <Label htmlFor="partial" className="flex-1">
                <div>
                  <p className="font-medium">Partial Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay ₹{getFormattedAmount(calculateAdvancePayment())} now
                    (Advance 20% of rent)
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
                    Pay full amount ₹{getFormattedAmount(cart.discountedTotal)}
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Amount to Pay */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center">
            <span className="font-medium dark:text-black">Amount to Pay</span>
            <span className="text-2xl font-bold text-yellow-600">
              ₹
              {getFormattedAmount(
                paymentMethod === "partial"
                  ? calculateAdvancePayment()
                  : cart.discountedTotal
              )}
            </span>
          </div>
          {paymentMethod === "partial" && (
            <p className="text-sm text-gray-600 mt-1">
              Pay remaining Rent + Deposit (₹
              {getFormattedAmount(
                cart.discountedTotal - calculateAdvancePayment()
              )}
              ) at the time of pickup
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
            <Link href="/terms" className="text-yellow-600 hover:underline">
              Terms & Conditions
            </Link>
          </Label>
        </div>

        <div className=" flex items-center space-x-2">
          <Checkbox
            className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
            id="policy"
            checked={agreedToPolicy}
            onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
          />
          <Label
            htmlFor="policy"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <CancellationPolicyDialog>
              <span className="text-yellow-600 hover:underline cursor-pointer">
                Cancellation policy
              </span>
            </CancellationPolicyDialog>
          </Label>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          className="w-full bg-yellow-primary hover:bg-yellow-600 text-white font-semibold py-3"
          disabled={!agreeToTerms || !agreedToPolicy || loading}
        >
          Pay ₹
          {paymentMethod === "partial"
            ? `${getFormattedAmount(
                calculateAdvancePayment()
              )} and Reserve Booking`
            : `${getFormattedAmount(cart.cartTotal)} and Confirm Booking`}
        </Button>

        {/* Payment Methods */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3 text-center">
            100% Secure Payment By
            <Image
              src="/razorpay_icon.png"
              alt="razorpay"
              width={100}
              height={30}
              className="mx-auto"
            />
          </h4>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSummary;
