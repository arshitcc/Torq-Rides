"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon, MapPinIcon, ClockIcon, FilterIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tourData, tourCategories } from "@/data/tours";
import { useSearchParams } from "next/navigation";

export default function ToursPage() {
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    params.get("category") || "all"
  );

  const filteredTours =
    selectedCategory === "all"
      ? tourData
      : tourData.filter((tour) =>
          tour.category.some(
            (cat) =>
              cat.toLowerCase() ===
              selectedCategory.toLowerCase().replace("-tours", "")
          )
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover Amazing
            <span className="text-primary block">Adventures</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            From guided expeditions to self-riding adventures, find the perfect
            tour that matches your spirit of exploration.
          </p>

          {/* Category Filter */}
          <div className="max-w-md mx-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select tour category" />
              </SelectTrigger>
              <SelectContent>
                {tourCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTours.map((tour) => (
            <Link key={tour.id} href={`/tours/${tour.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden h-full gap-0 py-0">
                <div className="relative h-64">
                  <Image
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /> */}

                  {/* Category Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {tour.category.map((cat, index) => (
                      <Badge
                        key={index}
                        className="bg-primary text-primary-foreground text-xs"
                      >
                        {cat === "Self-Riding" ? "Self-Riding" : cat} Tours
                      </Badge>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Title Overlay */}

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{tour.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({tour.reviewCount.toLocaleString()}+ reviews)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ride Like a Pro with JustTravel!
          </h2>
          <p className="text-muted-foreground mb-6">
            Himalayas? Conquered. Safety? Guaranteed.
          </p>
          <Button
            size="lg"
            className="px-8 bg-yellow-primary hover:bg-yellow-600 font-semibold group dark:text-white"
          >
            Plan Your Adventure
          </Button>
        </div>
      </div>
    </div>
  );
}
