import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CarIcon,
  DollarSignIcon,
  CrownIcon,
  MountainIcon,
  BusIcon,
} from "lucide-react";

const categories = [
  {
    id: "budget",
    name: "Budget",
    description: "Affordable and reliable vehicles for everyday use",
    icon: DollarSignIcon,
    cars: ["Hyundai Creta", "Tata Nexon", "Suzuki Ertiga"],
    color:
      "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
  },
  {
    id: "premium",
    name: "Premium",
    description: "High-quality vehicles with advanced features",
    icon: CrownIcon,
    cars: ["Audi A4", "Mercedes-Benz A-Class", "Jaguar XE", "Volvo XC40"],
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Ultimate comfort and prestige vehicles",
    icon: CrownIcon,
    cars: [
      "BMW 7 Series",
      "Mercedes-Benz S-Class",
      "Range Rover Autobiography",
      "Volvo S90/XC90",
    ],
    color:
      "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300",
  },
  {
    id: "suvs",
    name: "SUVs",
    description: "Spacious and versatile sport utility vehicles",
    icon: CarIcon,
    cars: [
      "Toyota Fortuner",
      "Hyundai Creta",
      "MG Gloster",
      "Kia Seltos",
      "Range Rover Evoque",
      "BMW X7",
    ],
    color:
      "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300",
  },
  {
    id: "off-roader",
    name: "Off-Roader",
    description: "Rugged vehicles built for adventure and tough terrain",
    icon: MountainIcon,
    cars: [
      "Mahindra Thar",
      "Force Gurkha",
      "Jeep Wrangler",
      "Toyota Hilux",
      "Land Rover Defender",
    ],
    color: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
  },
  {
    id: "vans",
    name: "Vans",
    description: "Perfect for group travel and family trips",
    icon: BusIcon,
    cars: [
      "Toyota Innova Crysta",
      "Maruti Suzuki Ertiga",
      "Kia Carens",
      "Renault Triber",
      "Mahindra Marazzo",
    ],
    color: "bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300",
  },
];

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Choose Your Perfect
            <span className="text-primary block">Vehicle</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our extensive fleet of vehicles across different
            categories. From budget-friendly options to luxury rides, we have
            something for every journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} href={`/cars/${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-full ${category.color}`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Popular Models:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.cars.slice(0, 3).map((car, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {car}
                          </Badge>
                        ))}
                        {category.cars.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.cars.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
