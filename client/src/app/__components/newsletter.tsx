"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { newsletterSchema, type NewsletterFormData } from "@/schemas";
import { BellIcon, MailIcon, ZapIcon } from "lucide-react";

export function Newsletter() {
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      toast.success("Successfully  Subrmitted");
      form.reset();
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-100 to-yellow-500 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-black rounded-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-black rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-black rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex items-center justify-center mb-4">
          <BellIcon className="h-6 w-6 mr-2 animate-pulse" />
          <span className="font-semibold">Stay Connected</span>
          <BellIcon className="h-6 w-6 ml-2 animate-pulse" />
        </div>

        <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl mb-8 opacity-90">
          Subscribe to get notified about new motorcycle collections and
          exclusive offers
        </p>

        <div className="max-w-md mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="bg-white text-black pl-10 border-0 focus:ring-2 focus:ring-black/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-yellow-primary font-semibold px-6"
              >
                <ZapIcon className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-sm mt-4 opacity-75">
          Join 10,000+ riders getting exclusive deals and riding tips
        </p>
      </div>
    </section>
  );
}
