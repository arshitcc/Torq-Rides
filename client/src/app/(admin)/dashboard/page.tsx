"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  DollarSign,
  Users,
  Bike,
  Calendar,
  Plus,
  Eye,
  FileTextIcon,
  PowerOffIcon,
  PowerIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import { format } from "date-fns";
import { AdminMotorcycle, CustomerMotorcycle, UserRolesEnum } from "@/types";
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

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied !!");
      router.push("/");
      return;
    }

    // Fetch data
    getAllMotorcycles();
    getAllCoupons();
    getAllBookings();
    getAllMotorcycleLogs({ page: 1, offset: 10 });
  }, [user, getAllMotorcycles, getAllCoupons, getAllBookings, router, toast]);

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

  const handleUpdateMotorcycle = (
    motorcycle: CustomerMotorcycle | AdminMotorcycle
  ) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-green-100 text-green-800";
      case "DUE-SERVICE":
        return "bg-yellow-100 text-yellow-800";
      case "IN-SERVICE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your motorcycle rental business</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
                <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
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
                <Users className="h-4 w-4 text-muted-foreground" />
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
                <Bike className="h-4 w-4 text-muted-foreground" />
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
                <Plus className="h-4 w-4 mr-2" />
                New Motorcycle
              </Button>
            </Link>
          </div>

          <Card className="border-yellow-primary/20">
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
                                motorcycle.image?.url ||
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateMotorcycle(motorcycle)
                                  }
                                  className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                                >
                                  <EditIcon className="h-4 w-4" />
                                </Button>
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

          {/* Update Motorcycle Dialog */}
          <Dialog
            open={showUpdateMotorcycleDialog}
            onOpenChange={setShowUpdateMotorcycleDialog}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Motorcycle</DialogTitle>
                <DialogDescription>
                  Update the motorcycle details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...updateMotorcycleForm}>
                <form
                  onSubmit={updateMotorcycleForm.handleSubmit(
                    onUpdateMotorcycle
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateMotorcycleForm.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Harley Davidson"
                              {...field}
                              className="border-yellow-primary/30 focus:border-yellow-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateMotorcycleForm.control}
                      name="vehicleModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Street 750"
                              {...field}
                              className="border-yellow-primary/30 focus:border-yellow-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={updateMotorcycleForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="border-yellow-primary/30 focus:border-yellow-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateMotorcycleForm.control}
                      name="rentPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rent per Day (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="border-yellow-primary/30 focus:border-yellow-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateMotorcycleForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-yellow-primary/30 focus:border-yellow-primary">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TOURING">Touring</SelectItem>
                              <SelectItem value="SPORTS">Sports</SelectItem>
                              <SelectItem value="CRUISER">Cruiser</SelectItem>
                              <SelectItem value="ADVENTURE">
                                Adventure
                              </SelectItem>
                              <SelectItem value="SCOOTER">Scooter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={updateMotorcycleForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the motorcycle..."
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setShowUpdateMotorcycleDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-yellow-primary hover:bg-yellow-600 text-black"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Coupon Management</h2>
            <Dialog
              open={showAddCouponDialog}
              onOpenChange={setShowAddCouponDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coupon
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Coupon</DialogTitle>
                  <DialogDescription>
                    Create a new discount coupon for customers.
                  </DialogDescription>
                </DialogHeader>
                <Form {...couponForm}>
                  <form
                    onSubmit={couponForm.handleSubmit(onAddCoupon)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={couponForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coupon Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Summer Sale"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={couponForm.control}
                        name="promoCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promo Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., SUMMER20" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={couponForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="FLAT">
                                  Flat Amount
                                </SelectItem>
                                <SelectItem value="PERCENTAGE">
                                  Percentage
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={couponForm.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 500 or 20"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={couponForm.control}
                        name="minimumCartValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Cart Value</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 500 or 20"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={couponForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={
                                  field.value
                                    ? format(field.value, "yyyy-MM-dd")
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={couponForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={
                                  field.value
                                    ? format(field.value, "yyyy-MM-dd")
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={couponForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Make this coupon active immediately
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddCouponDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Coupon</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="border-yellow-primary/20">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon Name</TableHead>
                    <TableHead>Promo Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon._id}>
                      <TableCell className="font-medium">
                        {coupon.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {coupon.promoCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            coupon.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-4 items-center">
                          <Switch
                            checked={coupon.isActive}
                            onCheckedChange={(checked) =>
                              handleToggleCoupon(coupon._id, checked)
                            }
                          />

                          <Dialog
                            open={showUpdateCouponDialog}
                            onOpenChange={setShowUpdateCouponDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateCoupon({
                                    ...coupon,
                                    type: coupon.type as "FLAT" | "PERCENTAGE",
                                  })
                                }
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Coupon</DialogTitle>
                                <DialogDescription>
                                  Update the details of this coupon
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...updateCouponForm}>
                                <form
                                  onSubmit={updateCouponForm.handleSubmit(
                                    onUpdateCoupon
                                  )}
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Coupon Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="e.g., Summer Sale"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="promoCode"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Promo Code</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="e.g., SUMMER20"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="type"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Discount Type</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger className="w-full">
                                                <SelectValue />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="FLAT">
                                                Flat Amount
                                              </SelectItem>
                                              <SelectItem value="PERCENTAGE">
                                                Percentage
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="discountValue"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Discount Value</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              placeholder="e.g., 500 or 20"
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(
                                                  Number(e.target.value)
                                                )
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={updateCouponForm.control}
                                      name="minimumCartValue"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Minimum Cart Value
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              placeholder="e.g., 500 or 20"
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(
                                                  Number(e.target.value)
                                                )
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="startDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Date</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="date"
                                              {...field}
                                              value={
                                                field.value
                                                  ? format(
                                                      field.value,
                                                      "yyyy-MM-dd"
                                                    )
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                field.onChange(
                                                  new Date(e.target.value)
                                                )
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={updateCouponForm.control}
                                      name="expiryDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Expiry Date</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="date"
                                              {...field}
                                              value={
                                                field.value
                                                  ? format(
                                                      field.value,
                                                      "yyyy-MM-dd"
                                                    )
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                field.onChange(
                                                  new Date(e.target.value)
                                                )
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={updateCouponForm.control}
                                    name="isActive"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                          <FormLabel className="text-base">
                                            Active
                                          </FormLabel>
                                          <div className="text-sm text-muted-foreground">
                                            Make this coupon active immediately
                                          </div>
                                        </div>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  <DialogFooter>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        setShowUpdateCouponDialog(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit">Update Coupon</Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Coupon
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this coupon?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCoupon(coupon._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                            <Eye className="h-4 w-4" />
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
      <Dialog
        open={showMaintenanceDialog}
        onOpenChange={setShowMaintenanceDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maintenance Logs</DialogTitle>
            <DialogDescription>
              View maintenance history for {selectedMotorcycle?.make}{" "}
              {selectedMotorcycle?.vehicleModel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {logs
              .filter((log) => log.motorcycleId === selectedMotorcycle?._id)
              .map((log) => (
                <div key={log._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                    <span className="text-sm text-gray-500 space-x-3">
                      {log.dateIn &&
                        "Date In" + format(log.dateIn, "MMM dd, yyyy")}
                      {log.dateOut &&
                        "Date Out" + format(log.dateOut, "MMM dd, yyyy")}
                    </span>
                  </div>
                  {/* <p className="text-sm mb-2">{log.reportMessage}</p> */}
                  <p className="text-sm font-semibold">
                    Cost: ₹{log.billAmount}
                  </p>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMaintenanceDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
