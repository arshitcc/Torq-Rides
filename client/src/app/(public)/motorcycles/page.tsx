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
  FilterXIcon,
  SlidersHorizontalIcon,
  ArrowDownNarrowWideIcon,
} from "lucide-react";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useDebounceValue } from "usehooks-ts";
import {
  AvailableMotorcycleCategories,
  AvailableMotorcycleMakes,
  MotorcycleCategory,
  MotorcycleMake,
} from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import MotorcycleCardSkeleton from "./__components/motorcycle-card-skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sortTypes = [
  {
    value: "Newest",
    label: "Newest",
  },
  {
    value: "Rating",
    label: "Rating",
  },
  {
    value: "Price: Low to High",
    label: "LTH",
  },
  {
    value: "Price: High to Low",
    label: "HTL",
  },
];

export default function MotorcyclesPage() {
  const router = useRouter();
  const { motorcycles, loading, getAllMotorcycles, metadata, setLoading } =
    useMotorcycleStore();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedCategory, setSelectedCategory] = useState<
    MotorcycleCategory | "All Categories"
  >("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue(
    searchTerm,
    700
  );
  const [selectedSort, setSelectedSort] = useState("Newest");

  useEffect(() => {
    if (params.make) setSelectedMake(params.make);
    if (params.category)
      setSelectedCategory(params.category as MotorcycleCategory);
  }, []);

  const getMotorcycles = async () => {
    const filters: Record<string, any> = {
      page: currentPage,
      offset: itemsPerPage,
    };

    if (debouncedSearchTerm?.trim()) {
      filters.searchTerm = debouncedSearchTerm.trim();
    } else {
      filters.searchTerm = undefined;
    }

    if (params.make?.trim()) {
      if (
        AvailableMotorcycleMakes.includes(params.make as MotorcycleMake) &&
        selectedMake === "All Makes"
      ) {
        filters.make = params.make;
      }
    } else if (selectedMake === "All Makes") {
      filters.make = undefined;
    } else {
      filters.make = selectedMake;
    }

    if (params.category?.trim()) {
      if (
        AvailableMotorcycleCategories.includes(
          params.category as MotorcycleCategory
        ) &&
        selectedCategory === "All Categories"
      ) {
        filters.category = params.category;
      } else {
        filters.category = selectedCategory;
      }
    } else if (selectedCategory === "All Categories") {
      filters.category = undefined;
    } else {
      filters.category = selectedCategory;
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (!isNaN(min) && min > 0) filters.minPrice = min;
    if (!isNaN(max) && max > 0) filters.maxPrice = max;

    filters.sort = selectedSort;

    const searchParams = new URLSearchParams();

    getAllMotorcycles(filters);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== "page" && key !== "offset")
          searchParams.set(key === "searchTerm" ? "s" : key, value);
      });
    }

    router.replace(`?${searchParams.toString()}`, { scroll: true });
  };

  const clearFilters = () => {
    setSelectedMake("All Makes");
    setSelectedCategory("All Categories");
    setMinPrice(0);
    setMaxPrice(0);
    setDebouncedSearchTerm("");
    getMotorcycles();
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getMotorcycles();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getMotorcycles();
  }, [debouncedSearchTerm, currentPage, selectedSort]);

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;
  const makes = AvailableMotorcycleMakes;
  const categories = AvailableMotorcycleCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Available Motorcycles</h1>
        <p className="text-xl text-muted-foreground">
          Discover your perfect ride from our premium collection
        </p>
      </div>

      <section className="sticky top-0 z-50 dark:bg-[#18181B] bg-white p-2 flex flex-col gap-4 rounded-2xl shadow-lg border border-gray-300 mb-8">
        {/* Search Input */}

        <div className="relative mb-0">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 placeholder:text-md" />
          <Input
            id="search"
            className="dark:text-white h-12 placeholder:font-normal text-md font-semibold pl-10 dark:bg-transparent text-yellow-500 focus-visible:border-yellow-500 dark:hover:border-yellow-500 border-1 border-gray-300 dark:border-gray-700 transition-all duration-200 ease-in-out"
            placeholder="Search by Brand or Model..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-between gap-5 md:hidden py-1">
          <div className="w-1/2">
            <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="w-full bg-gray-200 dark:bg-yellow-500 dark:text-white text-lg sm:text-sm"
                >
                  <ArrowDownNarrowWideIcon className="h-4 w-4 mr-2" />
                  Sort By
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Sort Options</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <RadioGroup
                  value={selectedSort}
                  onValueChange={setSelectedSort}
                  className="space-y-2"
                >
                  {sortTypes.map((type) => (
                    <DialogClose asChild key={type.label}>
                      {/* this div won’t produce a nested button */}
                      <div className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem value={type.label} id={type.label} />
                        <Label htmlFor={type.label}>{type.value}</Label>
                      </div>
                    </DialogClose>
                  ))}
                </RadioGroup>
                <DialogClose className="absolute top-2 right-2" />
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-1/2">
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger className="px-4" asChild>
                <Button
                  variant={"ghost"}
                  className="w-full bg-gray-200 dark:bg-yellow-500 dark:text-white text-lg sm:text-sm"
                >
                  <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md space-y-4">
                <DialogHeader>
                  <DialogTitle>Filter Motorcycles</DialogTitle>
                </DialogHeader>
                <div>
                  <Label
                    htmlFor="min-price"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Min Price
                  </Label>
                  <Input
                    id="min-price"
                    min={0}
                    placeholder="e.g., 500"
                    className="dark:text-white"
                    value={minPrice > 0 ? minPrice : ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0) setMinPrice(val);
                      else setMinPrice(0); // Reset or handle invalid input
                    }}
                  />
                </div>
                {/* Max Price */}
                <div>
                  <Label
                    htmlFor="max-price"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Max Price
                  </Label>
                  <Input
                    id="max-price"
                    min={0}
                    placeholder="e.g., 2000"
                    className="dark:text-white"
                    value={maxPrice > 0 ? maxPrice : ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0) setMaxPrice(val);
                      else setMaxPrice(0); // Reset or handle invalid input
                    }}
                  />
                </div>
                {/* Make Select */}
                <div>
                  <Label
                    htmlFor="make-select"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Make
                  </Label>
                  <Select value={selectedMake} onValueChange={setSelectedMake}>
                    <SelectTrigger
                      id="make-select"
                      className="w-full dark:text-white"
                    >
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
                  <Label
                    htmlFor="category-select"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Category
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      setSelectedCategory(
                        value as MotorcycleCategory | "All Categories"
                      )
                    }
                  >
                    <SelectTrigger
                      id="category-select"
                      className="w-full dark:text-white"
                    >
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      <SelectItem value={"All Categories"}>
                        All Categories
                      </SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col-reverse justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                  <DialogClose>
                    <div>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full sm:w-auto cursor-pointer dark:text-white dark:hover:text-white rounded-lg p-4"
                      >
                        <FilterXIcon className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  </DialogClose>
                  <DialogClose>
                    <div>
                      <Button
                        className="w-full sm:w-auto bg-yellow-primary cursor-pointer text-white"
                        onClick={applyFilters}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-8 gap-6">
        <div className="hidden md:flex sm:flex-col col-span-0 sm:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownNarrowWideIcon className="h-4 w-4 mr-2" />
                Sort By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedSort} onValueChange={setSelectedSort}>
                {sortTypes.map((type) => (
                  <div
                    key={type.label}
                    className="flex items-center gap-3 mb-2"
                  >
                    <RadioGroupItem value={type.label} id={type.label} />
                    <Label htmlFor={type.label}>{type.value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Min Price */}
              <div>
                <Label
                  htmlFor="min-price"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Min Price
                </Label>
                <Input
                  id="min-price"
                  min={0}
                  placeholder="e.g., 500"
                  className="dark:text-white"
                  value={minPrice > 0 ? minPrice : ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setMinPrice(val);
                    else setMinPrice(0); // Reset or handle invalid input
                  }}
                />
              </div>
              {/* Max Price */}
              <div>
                <Label
                  htmlFor="max-price"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Max Price
                </Label>
                <Input
                  id="max-price"
                  min={0}
                  placeholder="e.g., 2000"
                  className="dark:text-white"
                  value={maxPrice > 0 ? maxPrice : ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setMaxPrice(val);
                    else setMaxPrice(0); // Reset or handle invalid input
                  }}
                />
              </div>
              {/* Make Select */}
              <div>
                <Label
                  htmlFor="make-select"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Make
                </Label>
                <Select value={selectedMake} onValueChange={setSelectedMake}>
                  <SelectTrigger
                    id="make-select"
                    className="w-full dark:text-white"
                  >
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
                <Label
                  htmlFor="category-select"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) =>
                    setSelectedCategory(
                      value as MotorcycleCategory | "All Categories"
                    )
                  }
                >
                  <SelectTrigger
                    id="category-select"
                    className="w-full dark:text-white"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg">
                    <SelectItem value={"All Categories"}>
                      All Categories
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col-reverse justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto cursor-pointer dark:text-white dark:hover:text-white rounded-lg"
                >
                  <FilterXIcon className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button
                  className="w-full sm:w-auto bg-yellow-primary cursor-pointer text-white"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {loading ? (
          <div className="col-span-8 sm:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 px-1">
              {Array.from({ length: 6 }, (_, i) => (
                <MotorcycleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-8 md:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 px-1">
              {motorcycles.length <= 0 ? (
                <Card className="col-span-8 bg-muted/50 border-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="p-4 rounded-full bg-muted">
                      <FilterIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      No bikes available
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      We couldn’t find any matches. Try adjusting or clearing
                      your filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                motorcycles.map((motorcycle) => (
                  <Card
                    key={motorcycle._id}
                    className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer p-0"
                  >
                    <Link href={`/motorcycles/${motorcycle._id}`}>
                      <CardHeader className="p-0">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={motorcycle?.images[0].url || "/placeholder.svg"}
                            alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
                            fill
                            className="object-fit transform transition-transform duration-500 group-hover:scale-110"
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
                      <CardContent className="p-0">
                        <CardTitle className="text-xl text-center font-semibold mb-4">
                          {motorcycle.make} {motorcycle.vehicleModel}
                        </CardTitle>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 justify-items-center text-sm text-gray-600">
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
                      <CardFooter className="p-4 pt-0 mt-4">
                        <Button className="mx-auto cursor-pointer bg-yellow-primary hover:bg-yellow-600 font-semibold group dark:text-white">
                          Book Now
                          <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Link>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="overflow-x-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {1 + i}
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
          </div>
        )}
      </div>
    </div>
  );
}
