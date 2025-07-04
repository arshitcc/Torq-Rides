"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  FilterIcon,
  ArrowRightIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useDebounceValue } from "usehooks-ts";
import { AvailableMotorcycleCategories, MotorcycleCategory } from "@/types";

export default function MotorcyclesPage() {
  const { motorcycles, loading, getAllMotorcycles, metadata } =
    useMotorcycleStore();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedCategory, setSelectedCategory] = useState<
    MotorcycleCategory | "All Categories"
  >("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const itemsPerPage = 6;

  const getMotorcycles = async () => {
    const filters: Record<string, any> = {
      page: currentPage,
      offset: itemsPerPage,
    };

    if (debouncedSearchTerm?.trim())
      filters.searchTerm = debouncedSearchTerm.trim();

    if (selectedMake !== "All Makes") filters.make = selectedMake;
    if (
      selectedCategory !== "All Categories" &&
      AvailableMotorcycleCategories.includes(selectedCategory)
    ) {
      filters.category = selectedCategory;
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (!isNaN(min) && min > 0) filters.minPrice = min;
    if (!isNaN(max) && max > 0) filters.maxPrice = max;

    await getAllMotorcycles({
      page: currentPage,
      offset: itemsPerPage,
      ...filters,
    });
  };

  const clearFilters = () => {
    setSelectedMake("All Makes");
    setSelectedCategory("All Categories");
    setMinPrice(0);
    setMaxPrice(0);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getMotorcycles();
  };

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;

  useEffect(() => {
    getMotorcycles();
  }, [getAllMotorcycles, debouncedSearchTerm, currentPage]);

  const makes = Array.from(new Set(motorcycles.map((m) => m.make)));
  const categories = AvailableMotorcycleCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Available Motorcycles</h1>
        <p className="text-xl text-muted-foreground">
          Discover your perfect ride from our premium collection
        </p>
      </div>

      <section className="dark:bg-black bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                className="dark:text-white pl-10 dark:bg-transparent"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Min Price */}
          <div>
            <label
              htmlFor="min-price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Price
            </label>
            <Input
              id="min-price"
              type="number"
              min={0}
              placeholder="e.g., 500"
              className="dark:text-white"
              value={minPrice || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val) && val >= 0) setMinPrice(val);
                else setMinPrice(0); // Reset or handle invalid input
              }}
            />
          </div>

          {/* Max Price */}
          <div>
            <label
              htmlFor="max-price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Price
            </label>
            <Input
              id="max-price"
              type="number"
              min={0}
              placeholder="e.g., 2000"
              className="dark:text-white"
              value={maxPrice || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val) && val >= 0) setMaxPrice(val);
                else setMaxPrice(0); // Reset or handle invalid input
              }}
            />
          </div>

          <div className="flex gap-6">
            {/* Make Select */}
            <div>
              <label
                htmlFor="make-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Make
              </label>
              <Select value={selectedMake} onValueChange={setSelectedMake}>
                <SelectTrigger id="make-select" className="dark:text-white">
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg">
                  <SelectItem value="All Makes">All Makes</SelectItem>
                  {makes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(
                    value as MotorcycleCategory | "All Categories"
                  )
                }
              >
                <SelectTrigger id="category-select" className="dark:text-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg">
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full sm:w-auto cursor-pointer dark:text-white dark:hover:text-white rounded-lg"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button
            className="w-full sm:w-auto bg-yellow-primary cursor-pointer text-white"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2Icon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-12">
          <FilterIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No bikes available</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {motorcycles.map((motorcycle) => (
              <Card
                key={motorcycle._id}
                className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer p-0"
              >
                <Link href={`/motorcycles/${motorcycle._id}`}>
                  <CardHeader className="p-0">
                    <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                      <Image
                        src={motorcycle.image.url || "/placeholder.svg"}
                        alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
                        fill
                        className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 px-3 py-1 text-sm"
                      >
                        Available Now
                      </Badge>
                      <Badge className="absolute bottom-3 right-3 px-3 py-1 text-sm font-semibold bg-yellow-50 text-yellow-primary">
                        ₹{motorcycle.rentPerDay}/day
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-semibold mb-4">
                      {motorcycle.make} {motorcycle.vehicleModel}
                    </CardTitle>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span>{motorcycle.year}</span>
                      </div>
                      {motorcycle.specs?.power && (
                        <div className="flex items-center">
                          <span>{motorcycle.specs.power}</span>
                        </div>
                      )}
                      {motorcycle.specs?.engine && (
                        <div className="flex items-center">
                          <span>{motorcycle.specs.engine}</span>
                        </div>
                      )}
                      {motorcycle.specs?.weight && (
                        <div className="flex items-center">
                          <span>{motorcycle.specs.weight}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="mx-auto bg-yellow-primary hover:bg-yellow-600 text-black font-semibold group">
                      Book Now
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
