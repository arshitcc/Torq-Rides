"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Amazing experience! The bike was in perfect condition and the service was exceptional.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Priya Patel",
    rating: 5,
    comment:
      "TORQ Rides made my weekend trip unforgettable. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Arjun Singh",
    rating: 4,
    comment:
      "Great variety of bikes and excellent customer support. Will definitely use again.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 dark:bg-[#18181B]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 dark:text-white ">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">
            Real experiences from real riders
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg mb-6 italic">
                "{testimonials[currentIndex].comment}"
              </p>
              <div className="flex items-center justify-center">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage
                    src={
                      testimonials[currentIndex]?.avatar || "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {testimonials[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {testimonials[currentIndex].name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
