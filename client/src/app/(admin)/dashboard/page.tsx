"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  SearchIcon,
  CheckCircleIcon,
  FileTextIcon,
  InfoIcon,
  Trash2Icon,
  UserCogIcon,
  XCircleIcon,
  EditIcon,
  PowerOffIcon,
  PowerIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  AvailableMotorcycleCategories,
  AvailableMotorcycleMakes,
  type MotorcycleCategory,
  type MotorcycleMake,
  UserRolesEnum,
  UserRoles,
  User,
} from "@/types";
import {
  type CouponFormData,
  couponSchema,
  type UpdateCouponFormData,
  updateCouponSchema,
} from "@/schemas/coupons.schema";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useMotorcycleLogStore } from "@/store/motorcycle-log-store";
import { useDebounceValue } from "usehooks-ts";
import AddCouponDialog from "./__components/add-coupon-dialog";
import CouponsTable from "./__components/coupons-table";
import { getInitials, getStatusColor } from "./filters";
import { AssignRoleFormData } from "@/schemas/users.schema";
import UserInfoDialog from "./__components/users/user-info-dialog";
import ChangeRoleDialog from "./__components/users/change-role-dialog";
import UserDocumentsDialog from "./__components/users/user-documents-dialog";
import Image from "next/image";

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
  const {
    user,
    isAuthenticated,
    users,
    metadata: userMetadata,
    setUsers,
    assignRole,
    getAllUsers,
    deleteUserAccount,
    deleteUserDocument,
  } = useAuthStore();
  const {
    motorcycles,
    metadata: motorcycleMetadata,
    getAllMotorcycles,
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
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showAddCouponDialog, setShowAddCouponDialog] = useState(false);
  const [showUpdateCouponDialog, setShowUpdateCouponDialog] = useState(false);

  // Users management state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [showUserDocumentsDialog, setShowUserDocumentsDialog] = useState(false);
  const [newRole, setNewRole] = useState<UserRoles>(UserRolesEnum.CUSTOMER);

  // Users filters
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userVerificationFilter, setUserVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | UserRoles>(
    "all"
  );
  const [debouncedUserSearch] = useDebounceValue(userSearchTerm, 500);

  const [motorcyclesCurrentPage, setMotorcyclesCurrentPage] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedMake, setSelectedMake] = useState<
    MotorcycleMake | "All Makes"
  >("All Makes");
  const [selectedCategory, setSelectedCategory] = useState<
    MotorcycleCategory | "All Categories"
  >("All Categories");
  const [isAvailable, setIsAvailable] = useState<"true" | "false" | "all">(
    "all"
  );
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

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user || user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied !!");
      router.push("/");
      return;
    }

    const filters: Record<string, any> = {
      page: motorcyclesCurrentPage,
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

    if (isAvailable !== "all") filters.isAvailable = isAvailable;

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch data

    getAllMotorcycles(filters);
    getAllCoupons();
    getAllBookings();
    getAllMotorcycleLogs({ page: logsCurrentPage, offset: 10 });
  }, [
    user,
    getAllMotorcycles,
    getAllCoupons,
    getAllBookings,
    router,
    toast,
    selectedCategory,
    selectedMake,
    isAvailable,
    debouncedSearchTerm,
    motorcyclesCurrentPage,
  ]);

  useEffect(() => {
    const filters: Record<string, any> = {
      page: usersCurrentPage,
      offset: 10,
    };

    if (debouncedUserSearch?.trim())
      filters.searchTerm = debouncedUserSearch.trim();

    if (userVerificationFilter === "verified") filters.verification = true;
    if (userVerificationFilter === "unverified") filters.verification = false;

    if (userRoleFilter !== "all") filters.role = userRoleFilter.toUpperCase();

    window.scrollTo({ top: 0, behavior: "smooth" });
    getAllUsers(filters);
  }, [
    usersCurrentPage,
    debouncedUserSearch,
    userVerificationFilter,
    userRoleFilter,
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

  const handleChangeUserRole = async (
    data: AssignRoleFormData,
    userId: string
  ) => {
    try {
      // API call to change user role would go here

      await assignRole(userId, data);
      setUsers(
        users.map((u) =>
          u._id === selectedUser?._id ? { ...u, role: newRole } : u
        )
      );

      toast.success(`User role changed to ${newRole} successfully!`);
      setShowChangeRoleDialog(false);
      setSelectedUser(null);
    } catch (error: AxiosError | any) {
      toast.error("Failed to change user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // API call to delete user would go here
      await deleteUserAccount(userId);
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User deleted successfully!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteUserDocument = async (
    userId: string,
    documentId: string
  ) => {
    try {
      // API call to delete document would go here
      await deleteUserDocument(documentId);
      setUsers(
        users.map((u) =>
          u._id === userId
            ? {
                ...u,
                documents:
                  u.documents?.filter((d) => d._id !== documentId) || [],
              }
            : u
        )
      );
      setShowUserDocumentsDialog(false);
      toast.success("Document deleted successfully!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to delete document");
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

  const totalMotorcyclesPages =
    Math.ceil(motorcycleMetadata?.total / itemsPerPage) || 1;
  const totalUsersPages = Math.ceil(userMetadata?.total / itemsPerPage) || 1;

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
          <TabsTrigger value="users" className="cursor-pointer">
            Users
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

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="text-sm text-gray-600">
              Total Users: {userMetadata.total}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="w-full lg:w-3/5">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by name, email, or username..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-2/5 flex justify-between gap-4">
              <div className="lg:w-1/2 flex flex-col justify-center items-center">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status
                </Label>
                <Select
                  value={userVerificationFilter}
                  onValueChange={(value: "all" | "verified" | "unverified") =>
                    setUserVerificationFilter(value)
                  }
                >
                  <SelectTrigger className="mx-auto">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:w-1/2 flex flex-col justify-center items-center">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </Label>
                <Select
                  value={userRoleFilter}
                  onValueChange={(value: "all" | UserRoles) =>
                    setUserRoleFilter(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value={UserRolesEnum.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRolesEnum.CUSTOMER}>
                      Customer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Card className="border-yellow-primary/20 mb-4">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 &&
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={user.avatar?.url || "/placeholder.svg"}
                                alt={user.fullname}
                              />
                              <AvatarFallback>
                                {getInitials(user.fullname)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullname}</div>
                              <div className="text-sm text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === UserRolesEnum.ADMIN
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isEmailVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {/* Info Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowUserInfoDialog(true);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <InfoIcon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Change Role Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setNewRole(
                                        user.role === UserRolesEnum.ADMIN
                                          ? UserRolesEnum.CUSTOMER
                                          : UserRolesEnum.ADMIN
                                      );
                                      setShowChangeRoleDialog(true);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <UserCogIcon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Change Role</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Documents Button */}
                            {user.documents && user.documents.length > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setShowUserDocumentsDialog(true);
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      <FileTextIcon className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Documents</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {/* Delete Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-transparent"
                                      >
                                        <Trash2Icon className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete{" "}
                                          {user.fullname}? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteUser(user._id)
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete User
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete User</p>
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

          {totalUsersPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setUsersCurrentPage((p) => Math.max(p - 1, 1))
                    }
                    className={
                      usersCurrentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalUsersPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setUsersCurrentPage(i + 1)}
                      isActive={usersCurrentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setUsersCurrentPage((p) =>
                        Math.min(p + 1, totalUsersPages)
                      )
                    }
                    className={
                      usersCurrentPage === totalUsersPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* User Info Dialog */}
          <UserInfoDialog
            selectedUser={selectedUser}
            showUserInfoDialog={showUserInfoDialog}
            setShowUserInfoDialog={setShowUserInfoDialog}
          />

          {/* Change Role Dialog */}
          <ChangeRoleDialog
            selectedUser={selectedUser}
            newRole={newRole}
            setNewRole={setNewRole}
            showChangeRoleDialog={showChangeRoleDialog}
            setShowChangeRoleDialog={setShowChangeRoleDialog}
            handleChangeUserRole={handleChangeUserRole}
          />

          {/* User Documents Dialog */}
          <UserDocumentsDialog
            showUserDocumentsDialog={showUserDocumentsDialog}
            setShowUserDocumentsDialog={setShowUserDocumentsDialog}
            selectedUser={selectedUser}
            handleDeleteUserDocument={handleDeleteUserDocument}
          />
        </TabsContent>

        {/* Motorcycles Tab */}
        <TabsContent value="motorcycles">
          <div className="flex justify-between items-center mb-6">
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

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Avaialability
                </Label>

                <Select
                  value={isAvailable}
                  onValueChange={(value: "all" | "true" | "false") =>
                    setIsAvailable(value)
                  }
                >
                  <SelectTrigger id="make-select" className="dark:text-white">
                    <SelectValue placeholder="Select Avalability" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem key={"Available"} value={"true"}>
                      Avaialable
                    </SelectItem>
                    <SelectItem key={"Not Available"} value={"false"}>
                      Not Available
                    </SelectItem>
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
                                motorcycle?.images[0]?.url ||
                                "/placeholder.svg?height=48&width=48" ||
                                "/placeholder.svg"
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
                                <Link
                                  href={`/motorcycles/${motorcycle._id}/edit`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
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

          {totalMotorcyclesPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setMotorcyclesCurrentPage((p) => Math.max(p - 1, 1))
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
                      setMotorcyclesCurrentPage((p) =>
                        Math.min(p + 1, totalMotorcyclesPages)
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
    </div>
  );
}
