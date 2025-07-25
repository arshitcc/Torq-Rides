import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Motorcycle, MotorcycleCategory } from "@/types";
import { SearchIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MotorcyclesTableRow from "./motorcycles/motorcycles-table-row";
import { MotorcyclesTableRowSkeleton } from "./utils";
import { useMotorcycleStore } from "@/store/motorcycle-store";

interface MotorcyclesTabProps {
  motorcycles: Motorcycle[];
  motorcycleMetadata: any;
  handleDeleteMotorcycle: (motorcycleId: string) => void;
  setMotorcyclesCurrentPage: (page: number) => void;
  motorcyclesCurrentPage: number;
  totalMotorcyclesPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMake: string | "All Makes";
  setSelectedMake: (make: string | "All Makes") => void;
  selectedCategory: MotorcycleCategory | "All Categories";
  setSelectedCategory: (
    category: MotorcycleCategory | "All Categories"
  ) => void;
  branch: string | "All Branches";
  setBranch: (branch: string | "All Branches") => void;
  filters: any;
}

export default function MotorcyclesTab({
  motorcycles,
  handleDeleteMotorcycle,
  setMotorcyclesCurrentPage,
  motorcyclesCurrentPage,
  totalMotorcyclesPages,
  searchTerm,
  setSearchTerm,
  selectedMake,
  setSelectedMake,
  selectedCategory,
  setSelectedCategory,
  branch,
  setBranch,
  filters,
}: MotorcyclesTabProps) {
  const makes = filters.makes || [];
  const categories = filters.categories || [];
  const branches = filters.distinctCities || [];

  const { loading } = useMotorcycleStore();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Motorcycle Fleet Management</h2>
        <Link href="/motorcycles/new">
          <Button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Motorcycle
          </Button>
        </Link>
      </div>

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
              className="pl-10 dark:bg-transparent text-yellow-500 font-medium"
              placeholder="Search by make or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Make Select */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </Label>
            <Select
              value={selectedMake}
              onValueChange={(value) => setSelectedMake(value)}
            >
              <SelectTrigger
                id="make-select"
                className="dark:text-white w-full"
              >
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                <SelectItem value="All Makes">All Makes</SelectItem>
                {makes.map((m: string) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger
                id="branch-select"
                className="dark:text-white w-full"
              >
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                <SelectItem value="All Branches">All Branches</SelectItem>
                {branches.map((l: string) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div>
            <Label
              htmlFor="category-select"
              className="block text-sm font-medium text-gray-700 mb-1"
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
                className="dark:text-white w-full"
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                <SelectItem value={"All Categories"}>All Categories</SelectItem>
                {categories.map((c: string) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="border-yellow-primary/20 mb-4">
        <CardContent>
          <Table>
            <TableHeader className="text-md py-2 font-semibold hover:bg-white dark:hover:bg-[#18181B]">
              <TableRow className="hover:bg-white dark:hover:bg-[#18181B]">
                <TableHead>Motorcycle</TableHead>
                <TableHead>Rent/Day</TableHead>
                <TableHead>Available Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <MotorcyclesTableRowSkeleton key={index} />
                  ))
                : motorcycles.map((motorcycle) => (
                    <MotorcyclesTableRow
                      key={motorcycle._id}
                      motorcycle={motorcycle}
                      handleDeleteMotorcycle={handleDeleteMotorcycle}
                    />
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalMotorcyclesPages > 1 && (
        <Pagination className="overflow-x-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setMotorcyclesCurrentPage(
                    Math.max(motorcyclesCurrentPage - 1, 1)
                  )
                }
                className={
                  motorcyclesCurrentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalMotorcyclesPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setMotorcyclesCurrentPage(i + 1)}
                  isActive={motorcyclesCurrentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setMotorcyclesCurrentPage(
                    Math.min(motorcyclesCurrentPage + 1, totalMotorcyclesPages)
                  )
                }
                className={
                  motorcyclesCurrentPage === totalMotorcyclesPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
