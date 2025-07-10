import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, Users, Mountain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { offRoadTrips } from "@/data/off-roads";

export default function OffRoadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Off-Road
            <span className="text-primary block">Adventures</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Conquer challenging terrains and experience the thrill of off-road
            driving through India's most exciting landscapes. From ancient
            mountain ranges to purpose-built adventure parks.
          </p>

          {/* Features */}
          <div className="hidden lg:grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                <Mountain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">Safe Travel</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium">Flexible Cancellation</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium">Expert Guides</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium">Certified Instructors</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Adventure Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {offRoadTrips.map((trip) => (
            <Link key={trip.id} href={`/off-roads/${trip.id}`}>
              <Card className="group hover:shadow-xl py-0 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden h-full">
                <div className="relative h-80">
                  <Image
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {trip.category}
                    </Badge>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-lg mb-4 opacity-90">{trip.subtitle}</p>

                    {/* Location */}
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{trip.location}</span>
                    </div>

                    {/* Duration and Price */}
                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{trip.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {trip.rating} ({trip.reviewCount.toLocaleString()}+)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-background/50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">
            Conquer the Terrain with Confidence!
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Professional Training? Guaranteed. Adventure? Unlimited. Safety? Our
            Priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Book Your Adventure
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Adventures Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Trail Locations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5K+</div>
            <div className="text-muted-foreground">Happy Adventurers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
