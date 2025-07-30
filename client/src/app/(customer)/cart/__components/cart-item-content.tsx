import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { differenceInDays, format } from "date-fns";
import { EyeIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Cart, CartItem } from "@/types";
import { getFormattedAmount } from "@/lib/utils";

interface CartItemContentProps {
  item: CartItem;
  calculateItemBreakup: (item: CartItem) => {
    weekdayRate: number;
    weekendRate: number;
    weekdayCount: number;
    weekendCount: number;
    extraHours: number;
    extraHoursCharges: number;
    duration: string;
    taxPercentage: number;
    calculatedRent: number;
    totalTax: number;
    totalDiscount: number;
    totalItemRent: number;
    subtotal: number;
    securityDepositPerBike: number;
    securityDepositTotal: number;
    total: number;
    quantity: number;
  };
  handleRemoveItem: (motorcycleId: string) => Promise<void>;
}

function CartItemContent({
  item,
  calculateItemBreakup,
  handleRemoveItem,
}: CartItemContentProps) {
  const breakup = calculateItemBreakup(item);
  return (
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row items-center gap-2 px-0 md:px-2">
        {/* Motorcycle Image */}
        <div className="relative w-full md:w-64 h-64">
          <Link href={`/motorcycles/${item.motorcycleId}`}>
            <Image
              src={item.motorcycle?.images[0]?.url || "/placeholder.svg"}
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
                {item.motorcycle.make} {item.motorcycle.vehicleModel}
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
                {format(new Date(item.pickupDate), "MMM dd, yyyy")}
              </p>
              <p className="text-xs text-gray-500">{item.pickupTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Drop Off Date</p>
              <p className="font-medium">
                {format(new Date(item.dropoffDate), "MMM dd, yyyy")}
              </p>
              <p className="text-xs text-gray-500">{item.dropoffTime}</p>
            </div>
          </div>

          <p className="font-semibold pt-1">Duration: {item.duration}</p>

          {/* Trip Includes */}
          <div className="mb-4">
            <p className="font-medium mb-2">Your Trip Includes</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Original DL must be shown at pickup.</li>
              <li>
                • One original ID proof will be submitted at{" "}
                <span className="font-bold">{item.pickupLocation}</span> branch.
              </li>
              <li>
                • {item.motorcycle.kmsLimitPerDay} Free Kms, Fuel Excluded.
              </li>
              <li>
                • Extra Kms at ₹{item.motorcycle.extraKmsCharges}
                /Km.
              </li>
              <li>
                • ₹{item.motorcycle.securityDeposit} deposit will be refunded
                within 2 days after drop-off.
              </li>
              <li>• Only local trip allowed</li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center space-x-4">
              <div className="text-center w-full h-full">
                <p className="text-sm text-gray-500">Final Rent</p>
                <p className="font-semibold">
                  ₹{getFormattedAmount(breakup.subtotal)}
                </p>
              </div>
              <div className="text-center w-full h-full">
                <p className="text-sm text-gray-500">Security Deposit</p>
                <p className="font-semibold">
                  ₹{item.motorcycle.securityDeposit * item.quantity}
                </p>
              </div>
              <div className="text-center w-full h-full">
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-semibold">{item.quantity}</p>
              </div>
              {/* Price Breakup Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-yellow-primary">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Show Breakup
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Price Breakup</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <h4 className="font-semibold mb-2">
                        {item.motorcycle.make} {item.motorcycle.vehicleModel}
                      </h4>
                      <div className="space-y-2">
                        {breakup.weekdayCount > 0 && (
                          <div className="flex justify-between">
                            <span>
                              Weekday ({breakup.weekdayCount} days × ₹
                              {breakup.weekdayRate}):
                            </span>
                            <span>
                              ₹
                              {getFormattedAmount(
                                breakup.weekdayCount * breakup.weekdayRate
                              )}
                            </span>
                          </div>
                        )}

                        {breakup.weekendCount > 0 && (
                          <div className="flex justify-between">
                            <span>
                              Weekend ({breakup.weekendCount} days × ₹
                              {breakup.weekendRate}):
                            </span>
                            <span>
                              ₹
                              {getFormattedAmount(
                                breakup.weekendCount * breakup.weekendRate
                              )}
                            </span>
                          </div>
                        )}

                        <Separator />

                        {breakup.extraHours > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span>
                                Extra Hours ({breakup.extraHours} hrs):
                              </span>
                              <span>
                                ₹{getFormattedAmount(breakup.extraHoursCharges)}
                              </span>
                            </div>
                            <Separator />
                          </>
                        )}

                        <div className="flex justify-between">
                          <span>Rent Cost per Bike:</span>
                          <span>
                            ₹{getFormattedAmount(breakup.calculatedRent)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bike Quantity:</span>
                          <span>{breakup.quantity}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Rent:</span>
                          <span>
                            ₹{getFormattedAmount(breakup.totalItemRent)}
                          </span>
                        </div>
                        {breakup.totalDiscount > 0 && (
                          <div className="flex justify-between text-red-500">
                            <span>Discount:</span>
                            <span>
                              -₹
                              {getFormattedAmount(breakup.totalDiscount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax ({breakup.taxPercentage}% GST):</span>
                          <span>₹{getFormattedAmount(breakup.totalTax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Subtotal Rent :</span>
                          <span>₹{getFormattedAmount(breakup.subtotal)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Security Deposit per Bike:</span>
                          <span>
                            ₹
                            {getFormattedAmount(breakup.securityDepositPerBike)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{breakup.quantity}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Security Deposit Total:</span>
                          <span>
                            ₹{getFormattedAmount(breakup.securityDepositTotal)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold font-sans">
                          <span>Total:</span>
                          <span>₹{getFormattedAmount(breakup.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}

export default CartItemContent;
