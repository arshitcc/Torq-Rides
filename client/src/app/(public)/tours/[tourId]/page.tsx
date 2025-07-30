"use client";

import Image from "next/image";
import { ArrowLeftIcon, StarIcon, CheckIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tourData } from "@/data/tours";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import WhatsappIcon from "@/components/WhatsappIcon";
import { sendWhatsappMessage } from "@/lib/wa_me";

export default function TourDetailPage() {
  const params = useParams();

  const url = sendWhatsappMessage();

  const tour = tourData.find((t) => t.id === params.tourId);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tours">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to all tours
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left - Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={tour.image || "/placeholder.svg"}
                alt={tour.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  +{tour.gallery.length} Photos
                </Badge>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-4 gap-2">
              {tour.gallery.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6">
              <Link href={url}>
                <Button
                  size="lg"
                  className="w-full mb-4 bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                >
                  <WhatsappIcon />
                  Enquire Now
                </Button>
              </Link>

              {/* Inclusions Icons */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                      tour.inclusions.meals
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    🍽️
                  </div>
                  <div className="text-xs">Meals</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                      tour.inclusions.stays
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    🏨
                  </div>
                  <div className="text-xs">Stays</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                      tour.inclusions.transfers
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    🚐
                  </div>
                  <div className="text-xs">Transfers</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                      tour.inclusions.activities
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    🎯
                  </div>
                  <div className="text-xs">Activities</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tour Details */}
        <div className="max-w-4xl">
          {/* Title and Rating */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {tour.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(tour.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{tour.rating}</span>
                <span className="text-muted-foreground">
                  ({tour.reviewCount}+ Reviews)
                </span>
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              {tour.category.map((cat, index) => (
                <Badge key={index} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full ">
            <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">
                Inclusions & Exclusions
              </TabsTrigger>
              <TabsTrigger value="policy">Cancellation Policy</TabsTrigger>
              <TabsTrigger value="pack">Things To Pack</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {tour.description}
                </p>

                <h3 className="text-xl font-bold mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gallery */}
              <div>
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tour.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-32 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Itinerary</h3>
                <Accordion type="single" collapsible className="w-full">
                  {tour.itinerary.map((day) => (
                    <AccordionItem key={day.day} value={`day-${day.day}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <span className="font-medium">Day {day.day}</span>
                          <span className="ml-4">{day.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-muted-foreground">
                            {day.description}
                          </p>
                          <div>
                            <h4 className="font-medium mb-2">Activities:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {day.activities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="inclusions">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-green-600">
                    Inclusions
                  </h3>
                  <div className="space-y-3">
                    {tour.inclusionsList.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-red-600">
                    Exclusions
                  </h3>
                  <div className="space-y-3">
                    {tour.exclusionsList.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="policy">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Cancellation Policy</h3>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 p-3 text-left">
                          Time Period
                        </th>
                        <th className="border border-gray-300 p-3 text-left">
                          Cancellation Charge
                        </th>
                        <th className="border border-gray-300 p-3 text-left">
                          Refund Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          Upto 30 days
                        </td>
                        <td className="border border-gray-300 p-3 text-green-600">
                          Free Cancellation
                        </td>
                        <td className="border border-gray-300 p-3">
                          Full Refund (minus) booking amount
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          29-21 days
                        </td>
                        <td className="border border-gray-300 p-3 text-orange-600">
                          25% of the Trip Amount
                        </td>
                        <td className="border border-gray-300 p-3">
                          Refund (minus) 25% of the trip amount
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          21-15 days
                        </td>
                        <td className="border border-gray-300 p-3 text-orange-600">
                          50% of the Trip Amount
                        </td>
                        <td className="border border-gray-300 p-3">
                          Refund (minus) 50% of the trip amount
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          14-0 days
                        </td>
                        <td className="border border-gray-300 p-3 text-red-600">
                          100% of the Trip Amount
                        </td>
                        <td className="border border-gray-300 p-3">
                          No Refund
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Credit Note:</strong> The Booking Amount will be
                    credited to your JW Profile which can be accessed by logging
                    in to the website through your Email ID. Credit Notes issued
                    have no date of expiry and can be used entirely in any of
                    your future trips.
                  </p>
                  <p>
                    <strong>GST:</strong> Any GST charged on any transaction
                    will not be refunded.
                  </p>
                  <p>
                    <strong>Pending Refund:</strong> Any refund pending on your
                    booking will be credited to the same mode of payment through
                    which you paid in 5-7 working days.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pack">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Things To Pack</h3>

                <div className="grid gap-6">
                  {tour.thingsToPack.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-background/50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        🎒
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{item.item}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* FAQs */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">FAQs</h3>
            <Accordion type="single" collapsible className="w-full">
              {tour.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* About Destination */}
          <div className="mt-12 p-6 bg-background/50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">
              Everything you need to know about this destination
            </h3>
            <div className="italic text-muted-foreground mb-4">
              <p>A piece of poetry, a piece of heaven,</p>
              <p>A piece of serenity and solitude;</p>
              <p>That is the destination...</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A journey to this destination, whether it's summer or winter, is a
              dream of every traveler. And why is that a dream? It proudly
              showcases some of the most isolated vistas on the planet, as well
              as some of the highest settlements in the world.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary">
              View More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
