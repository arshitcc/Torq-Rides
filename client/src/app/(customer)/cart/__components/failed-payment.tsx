import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, HomeIcon, XCircleIcon, XIcon } from "lucide-react";
import Link from "next/link";

interface FailedPaymentProps {
  errorMessage: string;
  resetToCart?: () => void;
}

function FailedPayment({ errorMessage, resetToCart }: FailedPaymentProps) {
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

            <div className="space-y-6 flex flex-col">
              <Link href={"/my-bookings"}>
                <Button
                  onClick={resetToCart}
                  className="w-full bg-yellow-500 hover:bg-yellow/90"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Link>
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
              <p className="font-medium">hello@torqrides.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FailedPayment;
