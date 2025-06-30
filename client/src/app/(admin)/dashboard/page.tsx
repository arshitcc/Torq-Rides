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
import {
  addMotorcycleSchema,
  couponSchema,
  type AddMotorcycleFormData,
  type CouponFormData,
} from "@/schemas";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Edit,
  Trash2,
  Wrench,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { UserRolesEnum } from "@/types";

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

// Sample maintenance logs
const sampleMaintenanceLogs = [
  {
    _id: "1",
    motorcycleId: "bike1",
    date: new Date("2024-01-15"),
    reportMessage: "Regular service completed. Oil changed, brakes checked.",
    status: "OK" as const,
    cost: 2500,
  },
  {
    _id: "2",
    motorcycleId: "bike2",
    date: new Date("2024-01-10"),
    reportMessage: "Chain lubrication and tire pressure check required.",
    status: "DUE-SERVICE" as const,
    cost: 1200,
  },
  {
    _id: "3",
    motorcycleId: "bike3",
    date: new Date("2024-01-08"),
    reportMessage: "Engine service in progress. Expected completion in 2 days.",
    status: "IN-SERVICE" as const,
    cost: 8500,
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { motorcycles, getAllMotorcycles, addMotorcycle, deleteMotorcycle } =
    useMotorcycleStore();
  const { coupons, getAllCoupons, updateCoupon, deleteCoupon } =
    useCouponStore();
  const { bookings, getAllBookings } = useBookingStore();
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<any>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showAddMotorcycleDialog, setShowAddMotorcycleDialog] = useState(false);
  const [showAddCouponDialog, setShowAddCouponDialog] = useState(false);

  const motorcycleForm = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
    defaultValues: {
      make: "",
      vehicleModel: "",
      year: new Date().getFullYear(),
      isAvailable: true,
      pricePerDay: 0,
      description: "",
      category: "TOURING",
      specs: {},
    },
  });

  const couponForm = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      promoCode: "",
      type: "flat",
      startDate: new Date(),
      expiryDate: new Date(),
      discountValue: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.ADMIN) {
      toast.error("Access Denied");
      router.push("/");
      return;
    }

    // Fetch data
    getAllMotorcycles();
    getAllCoupons();
    getAllBookings();
  }, [user, getAllMotorcycles, getAllCoupons, getAllBookings, router, toast]);

  const handleToggleCoupon = async (couponId: string, isActive: boolean) => {
    try {
      await updateCoupon(couponId, { isActive });
      toast.success(
        `Coupon has been ${isActive ? "activated" : "deactivated"}.`
      );
    } catch (error) {
      toast.error("Failed to update coupon status.");
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId);
      toast.success("Coupon Deleted Successfully !!");
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
  };

  const handleDeleteMotorcycle = async (motorcycleId: string) => {
    try {
      await deleteMotorcycle(motorcycleId);
      toast.success("Motorcycle Deleted Successfully !!");
    } catch (error) {
      toast.error("Failed to delete motorcycle.");
    }
  };

  const onAddMotorcycle = async (data: AddMotorcycleFormData) => {
    try {
      await addMotorcycle(data);
      toast.success("Motorcycle Added to Collection !!");
      setShowAddMotorcycleDialog(false);
      motorcycleForm.reset();
    } catch (error) {
      toast.error("Failed to add motorcycle.");
    }
  };

  const onAddCoupon = async (data: CouponFormData) => {
    try {
      // API call would go here
      toast.success(`Coupon ${data.promoCode} is Live Now !!`);
      setShowAddCouponDialog(false);
      couponForm.reset();
    } catch (error) {
      toast.error(`Failed to add coupon ${data.promoCode}.`);
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
    (sum, booking) => sum + booking.totalCost,
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="motorcycles">Motorcycles</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    <Tooltip />
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Motorcycles Tab */}
        <TabsContent value="motorcycles">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Motorcycles</h2>
            <Dialog
              open={showAddMotorcycleDialog}
              onOpenChange={setShowAddMotorcycleDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Motorcycle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Motorcycle</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new motorcycle to your fleet.
                  </DialogDescription>
                </DialogHeader>
                <Form {...motorcycleForm}>
                  <form
                    onSubmit={motorcycleForm.handleSubmit(onAddMotorcycle)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={motorcycleForm.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Harley Davidson"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={motorcycleForm.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Street 750"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={motorcycleForm.control}
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={motorcycleForm.control}
                        name="pricePerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Day (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                        control={motorcycleForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                      control={motorcycleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the motorcycle..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={motorcycleForm.control}
                      name="isAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Available for Rent
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Make this motorcycle available for customers to
                              book
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
                        onClick={() => setShowAddMotorcycleDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Motorcycle</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motorcycles.map((motorcycle) => (
                    <TableRow key={motorcycle._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {motorcycle.make} {motorcycle.vehicleModel}
                          </div>
                          <div className="text-sm text-gray-500">
                            Year: {motorcycle.year}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{motorcycle.category}</Badge>
                      </TableCell>
                      <TableCell>₹{motorcycle.pricePerDay}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            motorcycle.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {motorcycle.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMotorcycle(motorcycle);
                              setShowMaintenanceDialog(true);
                            }}
                          >
                            <Wrench className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteMotorcycle(motorcycle._id)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Coupons</h2>
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

                    <div className="grid grid-cols-2 gap-4">
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
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="flat">
                                  Flat Amount
                                </SelectItem>
                                <SelectItem value="percentage">
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

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon Details</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{coupon.name}</div>
                          <div className="text-sm text-gray-500">
                            Code: {coupon.promoCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "flat"
                          ? `₹${coupon.discountValue}`
                          : `${coupon.discountValue}%`}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {format(new Date(coupon.startDate), "MMM dd, yyyy")}
                          </div>
                          <div className="text-gray-500">
                            to{" "}
                            {format(
                              new Date(coupon.expiryDate),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={coupon.isActive}
                            onCheckedChange={(checked) =>
                              handleToggleCoupon(coupon._id, checked)
                            }
                          />
                          <span className="text-sm">
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Report</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMaintenanceLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>
                        <div className="font-medium">
                          Motorcycle #{log.motorcycleId}
                        </div>
                      </TableCell>
                      <TableCell>{format(log.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {log.reportMessage}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{log.cost}</TableCell>
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
                    <Tooltip />
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
            {sampleMaintenanceLogs
              .filter((log) => log.motorcycleId === selectedMotorcycle?._id)
              .map((log) => (
                <div key={log._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {format(log.date, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{log.reportMessage}</p>
                  <p className="text-sm font-semibold">Cost: ₹{log.cost}</p>
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
