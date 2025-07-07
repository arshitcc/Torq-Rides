"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/schemas";
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from "lucide-react";

export default function ContactPage() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullname: "",
      email: "",
      contactNumber: "",
      enquiryMessage: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // API call would go here

      toast.success("Message Sent!", {
        description: "We'll get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Contact</h1>
        <p className="text-xl text-gray-600">
          Get in touch with us for any assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Details */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <PhoneIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+91 95601 98483</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MailIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">hello@torqrides.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gurgaon | Delhi</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ClockIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-600">
                      Mon - Sun: 9:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enquiry Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us an Enquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your contact number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enquiryMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enquiry Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full py-6 bg-yellow-500 text-white text-lg sm:text-md">
                    Submit Enquiry
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
