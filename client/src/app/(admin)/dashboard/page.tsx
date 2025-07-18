"use client";

import { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useCouponStore } from "@/store/coupon-store";
import { useBookingStore } from "@/store/booking-store";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type MotorcycleCategory,
  type MotorcycleMake,
  UserRolesEnum,
  UserRoles,
  User,
  AvailableInCities,
} from "@/types";
import type { AxiosError } from "axios";
import { useMotorcycleLogStore } from "@/store/motorcycle-log-store";
import { useDebounceValue } from "usehooks-ts";
import { AssignRoleFormData } from "@/schemas/users.schema";
import OverviewTab from "./__components/overview-tab";
import UsersTab from "./__components/users-tab";
import MotorcyclesTab from "./__components/motorcycles-tab";
import CouponsTab from "./__components/coupons-tab";
import MaintenanceTab from "./__components/maintenance-tab";
import AnalyticsTab from "./__components/analytics-tab";
import Loading from "@/app/loading";
import { UpdateMotorcycleLogFormData } from "@/schemas/motorcycle-logs.schema";

function DashboardComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );

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
    deleteMotorcycle,
    filters,
  } = useMotorcycleStore();
  const { coupons, getAllCoupons, deleteCoupon, updateCouponActiveStatus } =
    useCouponStore();
  const { bookings, getAllBookings } = useBookingStore();
  const {
    logs,
    getAllMotorcycleLogs,
    getMotorcycleLogFilters,
    deleteMotorcycleLog,
    updateMotorcycleLog,
    metadata: logMetadata,
    filters: logFilters,
  } = useMotorcycleLogStore();

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Users filters
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userVerificationFilter, setUserVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | UserRoles>(
    "all"
  );
  const [debouncedUserSearch] = useDebounceValue(userSearchTerm, 500);

  // Motorcycles filters
  const [motorcyclesCurrentPage, setMotorcyclesCurrentPage] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedMake, setSelectedMake] = useState<
    MotorcycleMake | "All Makes"
  >("All Makes");
  const [selectedCategory, setSelectedCategory] = useState<
    MotorcycleCategory | "All Categories"
  >("All Categories");
  const [branch, setBranch] = useState<AvailableInCities | "All Branches">(
    "All Branches"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);

  // Maintenance Log Filters
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [debouncedLogSearch] = useDebounceValue(logSearchTerm, 500);
  const [logStatusFilter, setLogStatusFilter] = useState<string | "All Status">(
    "All Status"
  );
  const [logBranchFilter, setLogBranchFilter] = useState<
    string | "All Branches"
  >("All Branches");
  const [logServiceCentreFilter, setLogServiceCentreFilter] = useState<
    string | "All Service Centers"
  >("All Service Centers");
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user || user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied !!");
      router.push("/");
      return;
    }

    // Fetch data based on active tab
    if (activeTab === "overview") {
      getAllBookings();
      getAllMotorcycles({});
    }
    if (activeTab === "users") {
      const userFilters: Record<string, any> = {
        page: usersCurrentPage,
        offset: 10,
      };
      if (debouncedUserSearch?.trim())
        userFilters.searchTerm = debouncedUserSearch.trim();
      if (userVerificationFilter === "verified")
        userFilters.verification = true;
      if (userVerificationFilter === "unverified")
        userFilters.verification = false;
      if (userRoleFilter !== "all")
        userFilters.role = userRoleFilter.toUpperCase();
      getAllUsers(userFilters);
    }
    if (activeTab === "motorcycles") {
      const motorcycleFilters: Record<string, any> = {
        page: motorcyclesCurrentPage,
        offset: itemsPerPage,
      };
      if (debouncedSearchTerm?.trim())
        motorcycleFilters.searchTerm = debouncedSearchTerm.trim();
      if (selectedMake !== "All Makes" && filters.makes.includes(selectedMake))
        motorcycleFilters.make = selectedMake;
      if (
        selectedCategory !== "All Categories" &&
        filters.categories.includes(selectedCategory)
      ) {
        motorcycleFilters.categories = selectedCategory;
      }
      if (branch !== "All Branches") motorcycleFilters.cities = branch;
      getAllMotorcycles(motorcycleFilters);
    }
    if (activeTab === "coupons") {
      getAllCoupons();
    }
    if (activeTab === "maintenance") {
      const logFilters: Record<string, any> = {
        page: logsCurrentPage,
        offset: 10,
      };
      if (debouncedLogSearch?.trim())
        logFilters.searchTerm = debouncedLogSearch.trim();
      if (logStatusFilter !== "All Status") logFilters.status = logStatusFilter;
      if (logBranchFilter !== "All Branches")
        logFilters.cities = logBranchFilter;
      if (logServiceCentreFilter !== "All Service Centers")
        logFilters.serviceCentre = logServiceCentreFilter;

      getMotorcycleLogFilters();
      getAllMotorcycleLogs(logFilters);
    }
    if (activeTab === "analytics") {
      // Fetch analytics data if needed
    }
  }, [
    user,
    isAuthenticated,
    router,
    activeTab,
    getAllBookings,
    getAllMotorcycles,
    getAllUsers,
    getAllCoupons,
    getAllMotorcycleLogs,
    motorcyclesCurrentPage,
    debouncedSearchTerm,
    selectedMake,
    selectedCategory,
    branch,
    usersCurrentPage,
    debouncedUserSearch,
    userVerificationFilter,
    userRoleFilter,
    logsCurrentPage,
    debouncedLogSearch,
    logStatusFilter,
    logBranchFilter,
    logServiceCentreFilter,
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard?tab=${value}`, { scroll: true });
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      setActiveTab("overview");
    }
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

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
      await assignRole(userId, data);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: data.role } : u))
      );
      toast.success(`User role changed to ${data.role} successfully!`);
    } catch (error: AxiosError | any) {
      toast.error("Failed to change user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
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
      toast.success("Document deleted successfully!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to delete document");
    }
  };

  const handleDeleteLog = async (motorcycleId: string, logId: string) => {
    try {
      await deleteMotorcycleLog(motorcycleId, logId);
      toast.success("Maintenance log deleted successfully!");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to delete maintenance log."
      );
    }
  };


  if (!user || user.role !== UserRolesEnum.ADMIN) {
    return null; // Or a loading/unauthorized component
  }

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.discountedTotal,
    0
  );
  const totalBookings = bookings.length;
  const totalCustomers = new Set(bookings.map((b) => b.customerId)).size;
  const totalMotorcycles = motorcycleMetadata?.total || 0;
  const totalMotorcyclesPages =
    Math.ceil(motorcycleMetadata?.total / itemsPerPage) || 1;
  const totalUsersPages = Math.ceil(userMetadata?.total / itemsPerPage) || 1;
  const totalLogPages = Math.ceil(logMetadata?.total / 10) || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your motorcycle rental business</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="motorcycles">Motorcycles</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            totalRevenue={totalRevenue}
            totalBookings={totalBookings}
            totalCustomers={totalCustomers}
            totalMotorcycles={totalMotorcycles}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab
            users={users}
            userMetadata={userMetadata}
            handleDeleteUser={handleDeleteUser}
            handleChangeUserRole={handleChangeUserRole}
            handleDeleteUserDocument={handleDeleteUserDocument}
            setUsersCurrentPage={setUsersCurrentPage}
            usersCurrentPage={usersCurrentPage}
            totalUsersPages={totalUsersPages}
            userSearchTerm={userSearchTerm}
            setUserSearchTerm={setUserSearchTerm}
            userVerificationFilter={userVerificationFilter}
            setUserVerificationFilter={setUserVerificationFilter}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
          />
        </TabsContent>
        <TabsContent value="motorcycles">
          <MotorcyclesTab
            motorcycles={motorcycles}
            motorcycleMetadata={motorcycleMetadata}
            handleDeleteMotorcycle={handleDeleteMotorcycle}
            setMotorcyclesCurrentPage={setMotorcyclesCurrentPage}
            motorcyclesCurrentPage={motorcyclesCurrentPage}
            totalMotorcyclesPages={totalMotorcyclesPages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedMake={selectedMake}
            setSelectedMake={setSelectedMake}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            branch={branch}
            setBranch={setBranch}
            filters={filters}
          />
        </TabsContent>
        <TabsContent value="coupons">
          <CouponsTab
            coupons={coupons}
            handleToggleCoupon={handleToggleCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
          />
        </TabsContent>
        <TabsContent value="maintenance">
          <MaintenanceTab
            logs={logs}
            filters={{ ...filters, ...logFilters }}
            handleDeleteLog={handleDeleteLog}
            updateMotorcycleLog={updateMotorcycleLog}
            logSearchTerm={logSearchTerm}
            setLogSearchTerm={setLogSearchTerm}
            logStatusFilter={logStatusFilter}
            setLogStatusFilter={setLogStatusFilter}
            logBranchFilter={logBranchFilter}
            setLogBranchFilter={setLogBranchFilter}
            logServiceCentreFilter={logServiceCentreFilter}
            setLogServiceCentreFilter={setLogServiceCentreFilter}
            logsCurrentPage={logsCurrentPage}
            setLogsCurrentPage={setLogsCurrentPage}
            totalLogPages={totalLogPages}
            logMetadata={logMetadata}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardComponent />
    </Suspense>
  );
}
