import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ZapIcon, StarIcon, ArrowRightIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <Image
        src="/home/img8.jpg"
        alt="TORQ Rides Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-primary rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-primary/60 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-yellow-primary rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <ZapIcon className="h-8 w-8 text-yellow-primary mr-2 animate-pulse" />
          <span className="text-yellow-primary font-semibold">
            Premium Motorcycle Rentals
          </span>
          <ZapIcon className="h-8 w-8 text-yellow-primary ml-2 animate-pulse" />
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </section>
  );
}
