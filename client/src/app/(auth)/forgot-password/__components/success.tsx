import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, MailIcon } from "lucide-react";
import Link from "next/link";

interface SuccessProps {
  email: string;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

function Success({ email, setIsSuccess }: SuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-yellow-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <MailIcon className="w-12 h-12 text-yellow-600 mx-auto opacity-60" />
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your Reset Password Link has been sent to your registered Email
                ID
              </p>
              <p className="text-sm text-yellow-600 font-medium">{email}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Please check your email and click the reset link to continue.
                The link will expire in 15 minutes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Link href="/login">Back to Login</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
              className="w-full"
            >
              Send Another Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Success;
