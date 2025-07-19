"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-yellow-50/50 dark:bg-[#18181B]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Policies & Agreements
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Please read our terms and cancellation policy carefully before
            booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terms and Conditions Card */}
          <Card className="shadow-lg bg-white dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800 dark:text-gray-200">
                <FileText className="h-6 w-6 text-yellow-500" />
                Terms and Conditions
              </CardTitle>
              <CardDescription>Last updated: July 19, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  1. Rider Eligibility
                </h3>
                <p>
                  All riders must be at least 21 years of age and possess a
                  valid motorcycle driving license. An original ID (Aadhaar,
                  Voter ID, or Passport) is required for verification at the
                  time of pickup.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  2. Booking and Payment
                </h3>
                <p>
                  Bookings are confirmed only after receipt of the advance or
                  full payment. Payments can be made online through our secure
                  payment gateway.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  3. Security Deposit
                </h3>
                <p>
                  A refundable security deposit is collected for each
                  motorcycle at the time of pickup. The deposit is refunded in
                  full after the motorcycle is returned in its original
                  condition. Any costs for damages, fines, or missing
                  accessories will be deducted from this deposit.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  4. Rider's Responsibilities
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    The rider is responsible for the motorcycle's fuel. The
                    motorcycle will be provided with a full tank and must be
                    returned with a full tank.
                  </li>
                  <li>
                    The rider must wear a helmet at all times. We provide one
                    complimentary helmet with each booking.
                  </li>
                  <li>
                    The rider must not use the motorcycle for any illegal
                    activities, racing, or stunts.
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  5. Accidents and Breakdowns
                </h3>
                <p>
                  In case of an accident or breakdown, the rider must contact us
                  immediately. The rider is responsible for any damages to the
                  motorcycle up to the security deposit amount. For damages
                  exceeding the deposit, insurance claims will be processed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy Card */}
          <Card className="shadow-lg bg-white dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800 dark:text-gray-200">
                <ShieldCheck className="h-6 w-6 text-yellow-500" />
                Cancellation & Refund Policy
              </CardTitle>
              <CardDescription>
                Clear and fair cancellation terms for your peace of mind.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800/30">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Key Refund Information
                </h4>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>
                    The <strong>Security Deposit</strong>, if paid as part of a
                    full payment, is always 100% refundable upon cancellation.
                  </li>
                  <li>
                    Cancellation charges are calculated based on the{" "}
                    <strong>Total Rental Cost</strong> of the booking.
                  </li>
                  <li>
                    Refunds are processed to the original payment method within
                    5-7 business days.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  Cancellation Slabs
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    More than 7 days before pick-up date:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>
                      A flat <strong>CANCELLATION_CHARGE</strong> of ₹199 will
                      be deducted from the amount you have paid.
                    </li>
                    <li>
                      <strong>Refund Amount</strong> = (Amount Paid -
                      CANCELLATION_CHARGE).
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Between 3 to 7 days before pick-up date:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>
                      <strong>Cancellation Charge:</strong> 50% of the Total
                      Rental Cost.
                    </li>
                    <li>
                      <strong>Refund Amount</strong> = (Amount Paid - 50% of
                      Rent). The security deposit portion is fully refunded.
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Within 3 days of pick-up date:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>
                      <strong>Cancellation Charge:</strong> 100% of the Total
                      Rental Cost.
                    </li>
                    <li>
                      <strong>Refund Amount:</strong> Only the Security Deposit
                      (if paid) will be refunded. The rental amount is
                      non-refundable.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
