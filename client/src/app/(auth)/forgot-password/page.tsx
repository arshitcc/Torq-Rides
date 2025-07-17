"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  forgotPasswordRequestSchema,
  type ForgotPasswordFormData,
} from "@/schemas/users.schema";
import { MailIcon, ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Success from "./__components/success";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { forgotPasswordRequest, loading, isAuthenticated } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      user: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordRequest(data);
      setEmail(data.user);
      setIsSuccess(true);
      toast.success("Reset password link sent successfully!");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset password link"
      );
    }
  };

  if (isSuccess) {
    return <Success email={email} setIsSuccess={setIsSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-[#121212] dark:via-[#121212] dark:to-[#18181B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-[#171717] backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <MailIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your username or email address and we'll send you a link to
            reset your password.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Username or Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username or email"
                        className="h-12 border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button
              variant="ghost"
              asChild
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            >
              <Link href="/login" className="flex items-center">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
            >
              Sign up here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
