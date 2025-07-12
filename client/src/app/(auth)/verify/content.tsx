"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
  MailIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, verifyEmail, user } = useAuthStore();
  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.isEmailVerified) {
      handleRedirect();
      return;
    }
    const token = searchParams.get("token");

    if (!token) {
      setVerificationState("error");
      setMessage("Invalid verification link");
      return;
    }

    const handleVerification = async () => {
      try {
        const result = await verifyEmail(token);
        if (!result) {
          setVerificationState("error");
          setMessage("Email verification failed. Please try again.");
          return;
        }
        setVerificationState("success");
        setMessage("Your email has been successfully verified!");

        // Redirect after 2 seconds
        setTimeout(() => {
          handleRedirect();
        }, 2000);
      } catch (error: any) {
        setVerificationState("error");
        setMessage(
          error.message || "Email verification failed. Please try again."
        );
        toast.error("Email verification failed");
      }
    };

    window.scrollTo({ top: 0, behavior: "smooth" });

    handleVerification();
  }, [searchParams, verifyEmail, isAuthenticated, router]);

  const handleRedirect = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-[#121212] dark:via-[121212] dark:to-[#18181B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-[#171717] backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 relative">
            {verificationState === "loading" && (
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Loader2Icon className="w-8 h-8 text-yellow-600 animate-spin" />
              </div>
            )}
            {verificationState === "success" && (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            )}
            {verificationState === "error" && (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {verificationState === "loading" && "Verifying Email"}
            {verificationState === "success" && "Email Verified!"}
            {verificationState === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <MailIcon className="w-12 h-12 text-yellow-600 mx-auto opacity-60" />
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {verificationState === "loading" &&
                "Please wait while we verify your email address..."}
              {message}
            </p>
          </div>

          {verificationState === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Redirecting you to{" "}
                  {isAuthenticated ? "your profile" : "login page"} in a
                  moment...
                </p>
              </div>
              <Button
                onClick={handleRedirect}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Continue to {isAuthenticated ? "Profile" : "Login"}
              </Button>
            </div>
          )}

          {verificationState === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  The verification link may be expired or invalid.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="cursor-pointer flex-1"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                >
                  Sign Up Again
                </Button>
              </div>
            </div>
          )}

          {verificationState === "loading" && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
