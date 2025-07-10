import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react";

function MotorcycleNotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-[#121212] dark:via-[#121212] dark:to-[#18181B] p-4">
      <Card className="w-full max-w-md text-center p-8 bg-white/80 dark:bg-[#171717] backdrop-blur-sm">
        <CardTitle className="text-2xl font-bold mb-2">
          Motorcycle Not Found
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We couldn’t find the motorcycle you’re looking for.
        </p>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => router.push("/motorcycles")}>
          Back to Listings
        </Button>
      </Card>
    </div>
  );
}

export default MotorcycleNotFound;
