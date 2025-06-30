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
  Loader2Icon,
  CogIcon,
  CalendarIcon,
  ScaleIcon,
  FuelIcon,
  ArrowRightIcon,
  BoomBoxIcon,
} from "lucide-react";
import { useMotorcycleStore } from "@/store/motorcycle-store";

export default function MotorcyclesPage() {
  const { motorcycles, loading, error, metadata, getAllMotorcycles } =
    useMotorcycleStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // load motorcycles on mount
  useEffect(() => {
    getAllMotorcycles({ page: currentPage, offset: itemsPerPage });
  }, [getAllMotorcycles]);

  // client-side filtering
  const filtered = motorcycles
    .filter((m) =>
      [m.make, m.vehicleModel]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((m) => !minPrice || m.pricePerDay >= +minPrice)
    .filter((m) => !maxPrice || m.pricePerDay <= +maxPrice)
    .filter((m) => selectedMake === "All Makes" || m.make === selectedMake)
    .filter(
      (m) =>
        selectedCategory === "All Categories" || m.category === selectedCategory
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const makes = ["All Makes", ...new Set(motorcycles.map((m) => m.make))];
  const categories = [
    "All Categories",
    ...new Set(motorcycles.map((m) => m.category)),
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2Icon className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Motorcycles</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search make or model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <Select value={selectedMake} onValueChange={setSelectedMake}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {makes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
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
            {currentItems.map((motorcycle) => (
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
                      <Badge
                        className="absolute bottom-3 right-3 px-3 py-1 text-sm font-semibold bg-yellow-50 text-yellow-primary"
                      >
                        ₹{motorcycle.pricePerDay}/day
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-semibold mb-4">
                      {motorcycle.make} {motorcycle.vehicleModel}
                    </CardTitle>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        <span>{motorcycle.year}</span>
                      </div>
                      <div className="flex items-center">
                        <CogIcon className="mr-2 h-5 w-5" />
                        <span>{motorcycle.specs.power}</span>
                      </div>
                      <div className="flex items-center">
                        <BoomBoxIcon className="mr-2 h-5 w-5" />
                        <span>{motorcycle.specs.engine}</span>
                      </div>

                      <div className="flex items-center">
                        <ScaleIcon className="mr-2 h-5 w-5" />
                        <span>{motorcycle.specs.weight}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="p-4 pt-0">
                  <Button
                    asChild
                    className="mx-auto bg-yellow-primary hover:bg-yellow-600 text-black font-semibold group"
                  >
                    <Link href={`/motorcycles/${motorcycle._id}`}>
                      Book Now
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(p - 1, 1));
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                    }}
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
