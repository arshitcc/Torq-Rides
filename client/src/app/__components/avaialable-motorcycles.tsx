"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Motorcycle {
  _id: number;
  category: string;
  image: string;
}

export function AvailableMotorcycles() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    fetch("/home/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => setMotorcycles(json.availableBikes))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#18181B]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 dark:text-white ">
            Available Motorcycles
          </h2>
          <p className="text-xl text-gray-600">
            Choose from our premium collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto">
          {motorcycles.map((motorcycle,i) => ( i<3 &&
            <Card
              key={motorcycle._id}
              className="overflow-hidden hover:shadow-lg transition-shadow py-0 pb-0 w-[300px] mx-auto"
            >
              <CardHeader className="p-0 cursor-pointer">
                <div className="relative overflow-hidden group">
                  <Image
                    src={motorcycle.image || "/placeholder.svg"}
                    alt={`${motorcycle.category}`}
                    height={300}
                    width={300}
                    className="object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-xl m-auto"
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {motorcycle.category}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/motorcycles">View All Motorcycles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
