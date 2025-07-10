"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, Fuel, Settings, MapPin, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { carData } from "@/data/cars";
import { sendWhatsappMessage } from "@/lib/wa_me";
import WhatsappIcon from "@/components/WhatsappIcon";

export default function CarDetailPage() {
  const url = sendWhatsappMessage();
  const params: { category: string; carId: string } = useParams();
  const cars = carData[params.category];
  const car = cars?.find((c) => c.id === params.carId);

  if (!car) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/cars/${params.category}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all cars
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Image and Details */}
          <div className="col-span-3 lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                width={600}
                height={400}
                className="w-full h-64 lg:h-96 object-fit"
              />
            </div>

            {/* Car Info */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {car.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {car.type} • {car.year}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-medium">{car.seats} Seats</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-medium">{car.fuelType}</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Settings className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-medium">{car.transmission}</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-medium">{car.location}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="col-span-3 ld:col-span-1 lg:sticky lg:top-8">
            <Card className="p-8">
              <Link href={url}>
                <Button size="lg" className="cursor-pointer w-full text-lg py-6 bg-yellow-primary text-white">
                  <WhatsappIcon/>Book Now
                </Button>
              </Link>

              <p className="text-center text-sm text-muted-foreground">
                No credit card required to reserve
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
