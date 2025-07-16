"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";

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
    <section className="py-16 dark:bg-[#18181B] bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">
            Riding Styles
          </h2>
          <p className="text-xl text-gray-600">
            Choose the one that suits you best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {motorcycles.map((motorcycle) => (
            <Card
              key={motorcycle._id}
              className="overflow-hidden hover:shadow-lg transition-shadow py-0"
            >
              <Link href={`/motorcycles?category=${motorcycle.category}`}>
                <CardHeader className="p-0 cursor-pointer">
                  <div className="relative w-full h-0 pb-[100%] overflow-hidden group rounded-xl">
                    <Image
                      src={motorcycle.image || "/placeholder.svg"}
                      alt={motorcycle.category}
                      layout="fill"
                      className="object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110 h-80 w-80"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {motorcycle.category}
                    </Badge>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 cursor-pointer">
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer bg-yellow-primary text-white hover:text-white text-lg"
          >
            <Link href="/motorcycles">View All Motorcycles</Link>
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
