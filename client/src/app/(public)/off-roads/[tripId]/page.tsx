"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  Calendar,
  Mountain,
} from "lucide-react";
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
import { notFound, useParams } from "next/navigation";
import { offRoadTrips } from "@/data/off-roads";
import { sendWhatsappMessage } from "@/lib/wa_me";
import WhatsappIcon from "@/components/WhatsappIcon";

export default function OffRoadTripDetailPage() {
  const url = sendWhatsappMessage();
  const params = useParams();
  const trip = offRoadTrips.find((t) => t.id === params.tripId);

  if (!trip) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/off-roads">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Off-Road Adventures
            </Button>
          </Link>
        </div>

        {/* Features Bar */}
        <div className="hidden lg:grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-1">
              <Mountain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium">Safe Travel</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium">Flexible Cancellation</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium">Expert Guides</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-medium">Certified Instructors</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium">24/7 Support</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <Image
            src={trip.image || "/placeholder.svg"}
            alt={trip.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Info */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">{trip.title}</h1>
              <p className="text-xl text-muted-foreground">{trip.subtitle}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(trip.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{trip.rating}</span>
                  <span className="text-muted-foreground">
                    ({trip.reviewCount}+ Reviews)
                  </span>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.groupSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mountain className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
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
                    {trip.description}
                  </p>

                  <h3 className="text-xl font-bold mb-4">
                    Adventure Highlights
                  </h3>
                  <ul className="space-y-2">
                    {trip.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Adventure Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Terrain Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.terrain.map((terrain, index) => (
                        <Badge key={index} variant="outline">
                          {terrain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Vehicles Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.vehicles.map((vehicle, index) => (
                        <Badge key={index} variant="outline">
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trip.gallery.map((image, index) => (
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
                        {index === trip.gallery.length - 1 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium">
                              +{trip.gallery.length - 2} Photos
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">Itinerary</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {trip.itinerary.map((day) => (
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
                      {trip.inclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
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
                      {trip.exclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
                            Upto 15 days
                          </td>
                          <td className="border border-gray-300 p-3 text-green-600">
                            Free Cancellation
                          </td>
                          <td className="border border-gray-300 p-3">
                            Full Refund
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">
                            14-7 days
                          </td>
                          <td className="border border-gray-300 p-3 text-orange-600">
                            25% of Trip Amount
                          </td>
                          <td className="border border-gray-300 p-3">
                            75% Refund
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">
                            6-3 days
                          </td>
                          <td className="border border-gray-300 p-3 text-orange-600">
                            50% of Trip Amount
                          </td>
                          <td className="border border-gray-300 p-3">
                            50% Refund
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">
                            2-0 days
                          </td>
                          <td className="border border-gray-300 p-3 text-red-600">
                            100% of Trip Amount
                          </td>
                          <td className="border border-gray-300 p-3">
                            No Refund
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pack">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Things To Pack</h3>
                  <div className="grid gap-6">
                    {trip.thingsToPack.map((item, index) => (
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
                {trip.faqs.map((faq, index) => (
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

            {/* About Adventure */}
            <div className="mt-12 p-6 bg-background/50 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                About <span className="text-yellow-primary">{trip.title}</span>
              </h3>
              <div className="italic text-muted-foreground mb-4">
                <p>A journey of courage, a test of skill,</p>
                <p>A dance with nature and iron will;</p>
                <p>That is the off-road adventure...</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                An off-road adventure through {trip.location}, whether it's
                conquering rocky terrains or navigating challenging obstacles,
                is a dream of every thrill-seeker. Experience the raw power of
                nature combined with the precision of modern off-road vehicles.
              </p>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Group Size: {trip.groupSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mountain className="h-4 w-4 text-muted-foreground" />
                  <span>Difficulty: {trip.difficulty}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Link href={url}>
                  <Button
                    size="lg"
                    className="w-full text-md bg-yellow-primary text-white"
                  >
                    <WhatsappIcon />
                    Enquire Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
