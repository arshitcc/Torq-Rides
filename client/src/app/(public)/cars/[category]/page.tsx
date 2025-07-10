"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, Fuel, Settings, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { carData } from "@/data/cars";

const categoryNames: Record<string, string> = {
  budget: "Budget Cars",
  premium: "Premium Cars",
  luxury: "Luxury Cars",
  suvs: "SUVs",
  "off-roader": "Off-Road Vehicles",
  vans: "Vans & MPVs",
};

export default function CategoryPage() {
  const params: { category: string } = useParams();
  const cars = carData[params.category];

  if (!cars) {
    notFound();
  }

  const categoryName = categoryNames[params.category] || "Cars";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cars">
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

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose from our selection of {cars.length} vehicles in this category
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Link key={car.id} href={`/cars/${params.category}/${car.id}`}>
              <Card className="group hover:shadow-xl py-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                <div className="relative">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    width={450}
                    height={300}
                    className="w-full h-64 object-fit"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Available Now
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {car.type} • {car.year}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{car.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
