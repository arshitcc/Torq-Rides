import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-400" />
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="text-gray-600">
          Add some motorcycles to your cart to get started.
        </p>
        <Button
          asChild
          className="bg-yellow-primary hover:bg-yellow-600 dark:text-white"
        >
          <Link href="/motorcycles">Browse Motorcycles</Link>
        </Button>
      </div>
    </div>
  );
}

export default EmptyCart;
