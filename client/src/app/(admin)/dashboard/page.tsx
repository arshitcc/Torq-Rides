"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useCouponStore } from "@/store/coupon-store";
import { useBookingStore } from "@/store/booking-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSignIcon,
  UsersIcon,
  BikeIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  FileTextIcon,
  PowerOffIcon,
  PowerIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  AvailableMotorcycleCategories,
  AvailableMotorcycleMakes,
  Motorcycle,
  MotorcycleCategory,
  MotorcycleMake,
  UserRolesEnum,
} from "@/types";
import {
  CouponFormData,
  couponSchema,
  UpdateCouponFormData,
  updateCouponSchema,
} from "@/schemas/coupons.schema";
import {
  UpdateMotorcycleFormData,
  updateMotorcycleSchema,
} from "@/schemas/motorcycles.schema";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMotorcycleLogStore } from "@/store/motorcycle-log-store";
import { useDebounceValue } from "usehooks-ts";
import MaintenanceDialog from "./__components/maintenance-dialog";
import UpdateMotorcycleDialog from "./__components/update-motorcycle-dialog";
import AddCouponDialog from "./__components/add-coupon-dialog";
import CouponsTable from "./__components/coupons-table";
import { getStatusColor } from "./filters";

// Sample data for charts
const salesData = [
  { name: "Jan", weekly: 12000, monthly: 45000, yearly: 180000 },
  { name: "Feb", weekly: 15000, monthly: 52000, yearly: 195000 },
  { name: "Mar", weekly: 18000, monthly: 48000, yearly: 210000 },
  { name: "Apr", weekly: 22000, monthly: 65000, yearly: 225000 },
  { name: "May", weekly: 25000, monthly: 70000, yearly: 240000 },
  { name: "Jun", weekly: 28000, monthly: 75000, yearly: 255000 },
];

const bikesSalesData = [
  { name: "Cruiser", value: 35, color: "#8884d8" },
  { name: "Sports", value: 25, color: "#82ca9d" },
  { name: "Adventure", value: 20, color: "#ffc658" },
  { name: "Touring", value: 15, color: "#ff7300" },
  { name: "Scooter", value: 5, color: "#00ff00" },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    motorcycles,
    metadata,
    getAllMotorcycles,
    updateMotorcycleDetails,
    updateMotorcycleAvailability,
    deleteMotorcycle,
  } = useMotorcycleStore();
  const {
    coupons,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateCouponActiveStatus,
  } = useCouponStore();
  const { bookings, getAllBookings } = useBookingStore();
  const { logs, getAllMotorcycleLogs } = useMotorcycleLogStore();
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<any>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showAddCouponDialog, setShowAddCouponDialog] = useState(false);
  const [showUpdateMotorcycleDialog, setShowUpdateMotorcycleDialog] =
    useState(false);
  const [showUpdateCouponDialog, setShowUpdateCouponDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedMake, setSelectedMake] = useState<
    MotorcycleMake | "All Makes"
  >("All Makes");
  const [selectedCategory, setSelectedCategory] = useState<
    MotorcycleCategory | "All Categories"
  >("All Categories");
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);

  const couponForm = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      promoCode: "",
      type: "FLAT",
      startDate: new Date(),
      expiryDate: new Date(),
      discountValue: 0,
      isActive: true,
      minimumCartValue: 0,
    },
  });

  const updateCouponForm = useForm<UpdateCouponFormData>({
    resolver: zodResolver(updateCouponSchema),
  });

  const updateMotorcycleForm = useForm<UpdateMotorcycleFormData>({
    resolver: zodResolver(updateMotorcycleSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user || user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied !!");
      router.push("/");
      return;
    }

    const filters: Record<string, any> = {
      page: currentPage,
      offset: itemsPerPage,
    };

    if (debouncedSearchTerm?.trim())
      filters.searchTerm = debouncedSearchTerm.trim();

    if (
      selectedMake !== "All Makes" &&
      AvailableMotorcycleMakes.includes(selectedMake)
    )
      filters.make = selectedMake;
    else filters.make = undefined;

    if (
      selectedCategory !== "All Categories" &&
      AvailableMotorcycleCategories.includes(selectedCategory)
    ) {
      filters.category = selectedCategory;
    }

    if (isAvailable) filters.isAvailable = isAvailable;

    // Fetch data
    getAllMotorcycles(filters);
    getAllCoupons();
    getAllBookings();
    getAllMotorcycleLogs({ page: 1, offset: 10 });
  }, [
    user,
    getAllMotorcycles,
    getAllCoupons,
    getAllBookings,
    router,
    toast,
    selectedCategory,
    selectedMake,
    debouncedSearchTerm,
    currentPage,
  ]);

  const handleToggleCoupon = async (couponId: string, isActive: boolean) => {
    try {
      await updateCouponActiveStatus(couponId, isActive);
      toast.success(
        `Coupon has been ${isActive ? "activated" : "deactivated"}.`
      );
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to update coupon status."
      );
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId);
      toast.success("Coupon Deleted Successfully !!");
    } catch (error: AxiosError | any) {
      toast.error(error?.response?.data?.message ?? "Failed to delete coupon.");
    }
  };

  const handleDeleteMotorcycle = async (motorcycleId: string) => {
    try {
      await deleteMotorcycle(motorcycleId);
      toast.success("Motorcycle Deleted Successfully !!");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to delete motorcycle."
      );
    }
  };

  const onAddCoupon = async (data: CouponFormData) => {
    try {
      // API call would go here
      await createCoupon(data);
      toast.success(`Coupon ${data.promoCode} is Live Now !!`);
      setShowAddCouponDialog(false);
      couponForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          `Failed to add coupon ${data.promoCode}.`
      );
    }
  };

  const onUpdateCoupon = async (data: UpdateCouponFormData) => {
    try {
      // API call would go here
      await updateCoupon(selectedCoupon._id, data);
      toast.success(`Coupon ${data.promoCode} is Updated Successfully !!`);
      setShowUpdateCouponDialog(false);
      updateCouponForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          `Failed to update coupon ${data.promoCode}.`
      );
    }
  };

  const handleToggleAvailability = async (
    motorcycleId: string,
    isAvailable: boolean
  ) => {
    try {
      await updateMotorcycleAvailability(motorcycleId, { isAvailable });
      toast.success(
        `Motorcycle has been marked as ${
          isAvailable ? "Available" : "Unavailable"
        }.`
      );
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update motorcycle availability."
      );
    }
  };

  const handleUpdateMotorcycle = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    updateMotorcycleForm.reset({
      make: motorcycle.make,
      vehicleModel: motorcycle.vehicleModel,
      year: motorcycle.year,
      rentPerDay: motorcycle.rentPerDay,
      description: motorcycle.description,
      category: motorcycle.category,
      variant: motorcycle.variant,
      color: motorcycle.color,
      securityDeposit: motorcycle.securityDeposit,
      kmsLimitPerDay: motorcycle.kmsLimitPerDay,
      extraKmsCharges: motorcycle.extraKmsCharges,
      availableQuantity: motorcycle.availableQuantity,
      specs: motorcycle.specs,
      isAvailable: motorcycle.isAvailable,
    });
    setShowUpdateMotorcycleDialog(true);
  };

  const handleUpdateCoupon = (coupon: CouponFormData) => {
    setSelectedCoupon(coupon);
    updateCouponForm.reset({
      name: coupon.name,
      promoCode: coupon.promoCode,
      type: coupon.type,
      startDate: new Date(coupon.startDate),
      expiryDate: new Date(coupon.expiryDate),
      discountValue: coupon.discountValue,
      isActive: coupon.isActive,
      minimumCartValue: coupon.minimumCartValue,
    });
    setShowUpdateCouponDialog(true);
  };

  const onUpdateMotorcycle = async (data: UpdateMotorcycleFormData) => {
    if (!selectedMotorcycle) return;

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "specs" && typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      await updateMotorcycleDetails(selectedMotorcycle._id, formData);
      toast.success("Motorcycle Updated Successfully !!");
      setShowUpdateMotorcycleDialog(false);
      setSelectedMotorcycle(null);
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message || "Motorcycle Update Failed !!"
      );
    }
  };

  if (!user || user.role !== UserRolesEnum.ADMIN) {
    return null;
  }

  // Calculate stats
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.discountedTotal,
    0
  );
  const totalBookings = bookings.length;
  const totalCustomers = new Set(bookings.map((b) => b.customerId)).size;
  const totalMotorcycles = motorcycles.length;

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;
  const makes = AvailableMotorcycleMakes;
  const categories = AvailableMotorcycleCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your motorcycle rental business</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
          <TabsTrigger value="overview" className="cursor-pointer">
            Overview
          </TabsTrigger>
          <TabsTrigger value="motorcycles" className="cursor-pointer">
            Motorcycles
          </TabsTrigger>
          <TabsTrigger value="coupons" className="cursor-pointer">
            Coupons
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="cursor-pointer">
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="cursor-pointer">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Motorcycles
                </CardTitle>
                <BikeIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMotorcycles}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Sales Overview
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey={selectedPeriod} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motorcycle Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bikesSalesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {bikesSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Motorcycles Tab */}
        <TabsContent value="motorcycles">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Motorcycle Fleet Management</h2>
            <Link href="/motorcycles/new">
              <Button className="cursor-pointer bg-yellow-primary hover:bg-yellow-600 text-black">
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
                  className="dark:text-white pl-10 dark:bg-transparent"
                  placeholder="Search by make or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <Select
                  value={selectedMake}
                  onValueChange={(value) =>
                    setSelectedMake(value as MotorcycleMake)
                  }
                >
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
                  <SelectTrigger
                    id="category-select"
                    className="dark:text-white"
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
          </div>

          <Card className="border-yellow-primary/20 mb-4">
            <CardContent>
              <Table>
                <TableHeader className="text-md py-2 font-semibold hover:bg-white dark:hover:bg-[#18181B]">
                  <TableRow className="hover:bg-white dark:hover:bg-[#18181B]">
                    <TableHead>Motorcycle</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rent/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Available Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motorcycles.map((motorcycle) => (
                    <TableRow key={motorcycle._id} className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={
                                motorcycle.images[0]?.url ||
                                "/placeholder.svg?height=48&width=48"
                              }
                              alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {motorcycle.make} {motorcycle.vehicleModel}
                            </div>
                            <div className="text-sm text-gray-500">
                              {motorcycle.year} • {motorcycle.variant}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-primary/10 text-yellow-primary"
                        >
                          {motorcycle.category}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{motorcycle.rentPerDay}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            motorcycle.isAvailable
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }
                        >
                          {motorcycle.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {motorcycle.availableQuantity}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/motorcycles/${motorcycle._id}/edit`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    // onClick={() =>
                                    //   handleUpdateMotorcycle(motorcycle)
                                    // }
                                    className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                                  >
                                    <EditIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Update Motorcycle</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/motorcycles/${motorcycle._id}/logs`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                                  >
                                    <FileTextIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Show Logs</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                                    >
                                      {motorcycle.isAvailable ? (
                                        <PowerOffIcon className="h-4 w-4" />
                                      ) : (
                                        <PowerIcon className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Change Availability
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to mark this
                                        motorcycle as{" "}
                                        {motorcycle.isAvailable
                                          ? "unavailable"
                                          : "available"}
                                        ?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleToggleAvailability(
                                            motorcycle._id,
                                            !motorcycle.isAvailable
                                          )
                                        }
                                        className="bg-yellow-primary hover:bg-yellow-600 text-black"
                                      >
                                        Confirm
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Change Availability</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="cursor-pointer text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                                    >
                                      <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Motorcycle
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        motorcycle? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteMotorcycle(motorcycle._id)
                                        }
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Motorcycle</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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

          {/* Update Motorcycle Dialog */}
          <UpdateMotorcycleDialog
            open={showUpdateMotorcycleDialog}
            setOpen={setShowUpdateMotorcycleDialog}
            updateMotorcycleForm={updateMotorcycleForm}
            onUpdateMotorcycle={onUpdateMotorcycle}
          />
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Coupon Management</h2>
            <AddCouponDialog
              open={showAddCouponDialog}
              setOpen={setShowAddCouponDialog}
              couponForm={couponForm}
              onAddCoupon={onAddCoupon}
            />
          </div>
          <CouponsTable
            open={showUpdateCouponDialog}
            setOpen={setShowUpdateCouponDialog}
            coupons={coupons}
            updateCouponForm={updateCouponForm}
            onUpdateCoupon={onUpdateCoupon}
            handleUpdateCoupon={handleUpdateCoupon}
            handleToggleCoupon={handleToggleCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
          />
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <h2 className="text-2xl font-bold mb-6">Maintenance Logs</h2>
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motorcycle</TableHead>
                    <TableHead>Date In</TableHead>
                    <TableHead>Date Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length > 0 &&
                    logs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell>
                          <div className="font-medium">
                            Motorcycle #
                            {log.motorcycleId?.slice(-8).toUpperCase()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log?.dateIn && format(log.dateIn, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {log?.dateOut && format(log.dateIn, "MMM dd, yyyy")}
                        </TableCell>
                        {/* <TableCell>
                          <div className="max-w-xs truncate">
                            {log.reportMessage}
                          </div>
                        </TableCell> */}
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{log.billAmount}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <h2 className="text-2xl font-bold mb-6">Advanced Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="monthly"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Confirmed</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cancelled</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: "5%" }}
                        ></div>
                      </div>
                      <span className="text-sm">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Maintenance Dialog */}
      <MaintenanceDialog
        open={showMaintenanceDialog}
        setOpen={setShowMaintenanceDialog}
        logs={logs}
        selectedMotorcycle={selectedMotorcycle}
      />
    </div>
  );
}
