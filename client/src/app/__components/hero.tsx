import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import SearchRides from "./search-rides";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
      <Image
        src="/home/img8.jpg"
        alt="TORQ Rides Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Ride Your{" "}
          <span className="bg-yellow-500 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Experience the thrill of premium motorcycles with our trusted rental
          service
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 bg-yellow-primary hover:bg-yellow-600 text-slate-100 font-semibold group"
          >
            <Link href="/motorcycles">
              Explore Bikes
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-yellow-primary text-yellow-primary bg-transparent hover:bg-yellow-50 font-semibold"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
        <SearchRides />
      </div>
    </section>
  );
}
