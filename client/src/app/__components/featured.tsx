"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function FeaturedBrands() {
  const [logos, setLogos] = useState<{ brand: string; img: string }[]>([]);
  const autoplay = Autoplay({ delay: 1500, stopOnInteraction: false });

  useEffect(() => {
    fetch("/home/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(
        (data: { featuredBikesImages: { brand: string; img: string }[] }) => {
          setLogos(data.featuredBikesImages);
        }
      )
      .catch((err) => {
        console.error("Error fetching logo data:", err);
      });
  }, []);

  return (
    <div className="bg-muted/30">
      {/* Heading Section */}

      <div className="text-center bg-muted/30 py-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Featured Brands
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose motorcycles from your loved manufacturer
        </p>
      </div>

      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="relative w-full cursor-pointer dark:bg-[#18181B] bg-muted/30"
        onMouseEnter={() => autoplay.stop()}
        onMouseLeave={() => autoplay.reset()}
      >
        <CarouselContent className="overflow-visible space-x-4">
          {logos?.length > 0 &&
            logos.map((logo, idx) => (
              <CarouselItem
                key={idx}
                className="basis-1/3 sm:basis-1/5 flex items-center justify-center p-4"
              >
                <Link href={`/motorcycles?make=${logo.brand}`}>
                  <Image
                    src={logo.img}
                    alt={`Brand logo ${idx + 1}`}
                    width={160}
                    height={240}
                    className="object-contain mix-blend-color"
                  />
                </Link>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
