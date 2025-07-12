"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/store/auth-store";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/users.schema";
import {
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetForgottenPassword, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setTokenError(true);
      toast.error("Invalid reset password link. No token provided.");
    } else {
      setToken(urlToken);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      await resetForgottenPassword(token, data);

      setIsSuccess(true);
      toast.success("Password reset successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: AxiosError | any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-[#121212] dark:via-[#121212] dark:to-[#18181B] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-[#171717] backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Invalid Link
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The reset password link is invalid or has expired.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                Please request a new password reset link.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              >
                Request New Link
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
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
              Password Reset Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <LockIcon className="w-12 h-12 text-yellow-600 mx-auto opacity-60" />
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 text-sm">
                Redirecting you to login page in a moment...
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-yellow-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your new password below to complete the reset process.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          className="h-12 border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{" "}
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="text-yellow-600 hover:text-yellow-700 font-medium p-0 h-auto"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}