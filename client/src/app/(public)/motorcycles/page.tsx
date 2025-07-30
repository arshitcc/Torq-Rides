"use client";

import { useState, useEffect, useRef } from "react";
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
  MapPinIcon,
} from "lucide-react";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useDebounceValue } from "usehooks-ts";
import { AvailableMotorcycleCategories, MotorcycleCategory } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSearchParams } from "next/navigation";
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
import { sortTypes } from "@/data";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FiltersSkeleton,
  LocationsSkeleton,
  SortBySkeleton,
} from "./__components/filters-skeleton";
import { getTodayPrice } from "@/lib/utils";

export default function MotorcyclesPage() {
  const {
    motorcycles,
    loading,
    getAllMotorcycles,
    metadata,
    filters: savedFilters,
    setFilters,
    getAllFilters,
  } = useMotorcycleStore();

  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMake, setSelectedMake] = useState("All Makes");

  const [selectedCategory, setSelectedCategory] = useState(
    savedFilters.selectedCategory || "All Categories"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 700);
  const [debouncedMinPrice] = useDebounceValue(minPrice, 700);
  const [debouncedMaxPrice] = useDebounceValue(maxPrice, 700);
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [cities, setCities] = useState(savedFilters.selectedCities || []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    getAllFilters();
  }, [getAllFilters]);

  useEffect(() => {
    const initialFilters: Record<string, any> = {
      page: 1,
      offset: itemsPerPage,
      sort: "Newest",
    };

    if (params.make?.trim()) {
      initialFilters.make = params.make.trim();
      setFilters({ ...savedFilters, selectedMake: params.make });
      setSelectedMake(params.make);
    }
    if (params.category?.trim()) {
      initialFilters.categories = params.category.trim();
      setFilters({ ...savedFilters, selectedCategory: params.category });
      setSelectedCategory(params.category as MotorcycleCategory);
    }
    if (params.location?.trim()) {
      const locations = [params.location.trim()];
      initialFilters.cities = locations.join("$");
      setFilters({ ...savedFilters, selectedCities: [params.location.trim()] });
      setCities(locations);
    }

    getAllMotorcycles(initialFilters);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    selectedMake,
    selectedCategory,
    cities,
    debouncedMinPrice,
    debouncedMaxPrice,
    selectedSort,
  ]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const getMotorcycles = async () => {
      const filters: Record<string, any> = {
        page: currentPage,
        offset: itemsPerPage,
        sort: selectedSort,
      };

      if (debouncedSearchTerm?.trim())
        filters.searchTerm = debouncedSearchTerm.trim();
      if (selectedMake !== "All Makes") {
        filters.make = selectedMake;
        setFilters({ ...savedFilters, selectedMake });
      }
      if (selectedCategory !== "All Categories") {
        filters.categories = selectedCategory;
        setFilters({ ...savedFilters, selectedCategory });
      }
      if (cities.length > 0) {
        filters.cities = cities.join("$");
        setFilters({ ...savedFilters, selectedCities: cities });
      }
      if (debouncedMinPrice > 0) filters.minPrice = debouncedMinPrice;
      if (debouncedMaxPrice > 0) filters.maxPrice = debouncedMaxPrice;

      window.scrollTo({ top: 0, behavior: "smooth" });
      getAllMotorcycles(filters);
    };

    getMotorcycles();
  }, [
    debouncedSearchTerm,
    currentPage,
    selectedSort,
    cities,
    selectedMake,
    selectedCategory,
    debouncedMinPrice,
    debouncedMaxPrice,
    getAllMotorcycles,
  ]);

  const clearFilters = () => {
    setSelectedMake("All Makes");
    setSelectedCategory("All Categories");
    setCities([]);
    setMinPrice(0);
    setMaxPrice(0);
    setSearchTerm("");
  };

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;
  const makes = savedFilters?.makes.sort((a, b) => a.localeCompare(b));
  const categories =
    savedFilters.categories.sort((a, b) => a.localeCompare(b)) ||
    AvailableMotorcycleCategories;
  const branches = savedFilters.distinctCities.sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Available Motorcycles</h1>
        <p className="text-xl text-muted-foreground">
          Discover your perfect ride from our premium collection
        </p>
      </div>

      <section className="sticky top-0 z-50 dark:bg-[#18181B] bg-white flex flex-col gap-4 rounded-2xl shadow-lg border border-gray-300 mb-8">
        {/* Search Input */}

        <div className="relative mb-0">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 placeholder:text-md" />
          <Input
            id="search"
            className="rounded-2xl border-none dark:text-white h-12 placeholder:font-normal text-md font-semibold pl-10 dark:bg-transparent text-yellow-500 focus-visible:border-yellow-500 dark:hover:border-yellow-500 border-1 border-gray-300 dark:border-gray-700 transition-all duration-200 ease-in-out"
            placeholder="Search by Brand or Model..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-between gap-5 md:hidden p-2">
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
              <DialogContent className="max-w-sm max-h-100 overflow-y-auto space-y-4">
                <DialogHeader>
                  <DialogTitle>Filter Motorcycles</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label className="block text-sm font-medium text-gray-400 mb-1">
                      Locations
                    </Label>
                    <div className="grid grid-cols-2">
                      {branches &&
                        branches.map((branch) => (
                          <div key={branch} className="flex gap-4">
                            <Checkbox
                              checked={cities.includes(branch)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setCurrentPage(1);
                                  setCities([...cities, branch]);
                                } else {
                                  setCurrentPage(1);
                                  setCities(cities.filter((b) => b !== branch));
                                }
                              }}
                              className="data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                            />
                            <Label>{branch}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
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
                    <Select
                      value={selectedMake}
                      onValueChange={setSelectedMake}
                    >
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
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full sm:w-auto"
                    >
                      <FilterXIcon className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-8 gap-6">
        <div className="hidden md:flex sm:flex-col col-span-0 sm:col-span-2 space-y-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
          {loading ? (
            <SortBySkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownNarrowWideIcon className="h-4 w-4 mr-2" />
                  Sort By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedSort}
                  onValueChange={setSelectedSort}
                >
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
          )}
          {loading ? (
            <LocationsSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {branches &&
                  branches.map((branch) => (
                    <div key={branch} className="flex gap-4">
                      <Checkbox
                        checked={cities.includes(branch)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCurrentPage(1);
                            setCities([...cities, branch]);
                          } else {
                            setCurrentPage(1);
                            setCities(cities.filter((b) => b !== branch));
                          }
                        }}
                        className="data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                      />
                      <Label>{branch}</Label>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
          {loading ? (
            <FiltersSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                </div>
              </CardContent>
            </Card>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-4 px-1">
              {motorcycles.length <= 0 ? (
                <Card className="col-span-8 bg-muted/50 border-0 shadow-none text-center">
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
                            src={
                              motorcycle?.images[0]?.url || "/placeholder.svg"
                            }
                            alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
                            fill
                            sizes="(max-width: 768px) 100vw,"
                            className="object-fit transform transition-transform duration-500 group-hover:scale-110"
                          />
                          <Badge className="absolute bottom-3 right-3 px-3 py-1 text-sm font-semibold bg-yellow-50 text-yellow-primary">
                            ₹{getTodayPrice(motorcycle)}/day
                          </Badge>

                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {motorcycle.categories
                              ?.slice(0, 2)
                              .map((category, index) => (
                                <Badge
                                  key={index}
                                  className="text-xs bg-yellow-500 text-white"
                                >
                                  {category}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-xl text-center font-semibold mb-4 line-clamp-2  min-h-[calc(2*2rem)]  ">
                          {motorcycle.make} {motorcycle.vehicleModel}
                        </CardTitle>
                        <div className="grid grid-cols-2 gap-4 justify-items-center text-sm text-gray-600">
                          {motorcycle.specs?.engine && (
                            <div className="flex items-center gap-2">
                              <Image
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ios-filled/100/E7B005/engine.png"
                                alt="Engine"
                              />
                              <span className="text-muted-foreground">
                                {motorcycle.specs.engine} cc
                              </span>
                            </div>
                          )}
                          {motorcycle.specs?.power && (
                            <div className="flex items-center gap-2">
                              <Image
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ios-filled/100/E7B005/electricity.png"
                                alt="Power"
                              />
                              <span className="text-muted-foreground">
                                {motorcycle.specs.power} ps
                              </span>
                            </div>
                          )}
                          {motorcycle.specs?.weight && (
                            <div className="flex items-center gap-2">
                              <Image
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ink/100/E7B005/weight-kg.png"
                                alt="weight-kg"
                              />
                              <span className="text-muted-foreground">
                                {motorcycle.specs.weight} kg
                              </span>
                            </div>
                          )}
                          {motorcycle.specs?.seatHeight && (
                            <div className="flex items-center gap-2">
                              <Image
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ios-filled/100/E7B005/motorcycle.png"
                                alt="Seat Height"
                              />
                              <span className="text-muted-foreground">
                                {motorcycle.specs.seatHeight} mm
                              </span>
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
