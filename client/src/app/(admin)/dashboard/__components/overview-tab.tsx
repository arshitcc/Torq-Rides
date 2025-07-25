// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   BikeIcon,
//   CalendarIcon,
//   DollarSignIcon,
//   UsersIcon,
// } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// // Sample data for charts
// const salesData = [
//   { name: "Jan", weekly: 12000, monthly: 45000, yearly: 180000 },
//   { name: "Feb", weekly: 15000, monthly: 52000, yearly: 195000 },
//   { name: "Mar", weekly: 18000, monthly: 48000, yearly: 210000 },
//   { name: "Apr", weekly: 22000, monthly: 65000, yearly: 225000 },
//   { name: "May", weekly: 25000, monthly: 70000, yearly: 240000 },
//   { name: "Jun", weekly: 28000, monthly: 75000, yearly: 255000 },
// ];

// const bikesSalesData = [
//   { name: "Cruiser", value: 35, color: "#8884d8" },
//   { name: "Superbike", value: 25, color: "#82ca9d" },
//   { name: "Adventure", value: 20, color: "#ffc658" },
//   { name: "Touring", value: 15, color: "#ff7300" },
//   { name: "Scooter", value: 5, color: "#00ff00" },
// ];

// interface OverviewTabProps {
//   totalRevenue: number;
//   totalBookings: number;
//   totalCustomers: number;
//   totalMotorcycles: number;
//   selectedPeriod: string;
//   setSelectedPeriod: (value: string) => void;
// }

// export default function OverviewTab({
//   totalRevenue,
//   totalBookings,
//   totalCustomers,
//   totalMotorcycles,
//   selectedPeriod,
//   setSelectedPeriod,
// }: OverviewTabProps) {
//   return (
//     <>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Revenue
//             </CardTitle>
//             <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               ₹{totalRevenue.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               +12% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Bookings
//             </CardTitle>
//             <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalBookings}</div>
//             <p className="text-xs text-muted-foreground">
//               +8% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Customers
//             </CardTitle>
//             <UsersIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalCustomers}</div>
//             <p className="text-xs text-muted-foreground">
//               +15% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Motorcycles
//             </CardTitle>
//             <BikeIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalMotorcycles}</div>
//             <p className="text-xs text-muted-foreground">+2 new this month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               Sales Overview
//               <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="weekly">Weekly</SelectItem>
//                   <SelectItem value="monthly">Monthly</SelectItem>
//                   <SelectItem value="yearly">Yearly</SelectItem>
//                 </SelectContent>
//               </Select>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <RechartsTooltip />
//                 <Bar dataKey={selectedPeriod} fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Motorcycle Categories</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={bikesSalesData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: ${value}%`}
//                 >
//                   {bikesSalesData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <RechartsTooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { DollarSign, Bike, Users, BookCopy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Stat Card Component for the top section
const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeText,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeText?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-card-foreground">{value}</h3>
          {change && changeText && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">{change}</span>{" "}
              {changeText}
            </p>
          )}
        </div>
        <div className="bg-muted rounded-full p-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function OverviewTab() {
  const { analytics, loading, getDashboardStats, getSalesOverview } =
    useBookingStore();
  const { stats, salesOverview } = analytics;
  const [salesView, setSalesView] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    getDashboardStats();
  }, [getDashboardStats]);

  useEffect(() => {
    getSalesOverview({ view: salesView });
  }, [getSalesOverview, salesView]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      change: "+12%",
      changeText: "from last month",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: BookCopy,
      change: "+8%",
      changeText: "from last month",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      change: "+15%",
      changeText: "from last month",
    },
    {
      title: "Total Motorcycles",
      value: stats.totalMotorcycles.toString(),
      icon: Bike,
      change: "+2",
      changeText: "new this month",
    },
  ];

  // Config for Pie Chart
  const PIE_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) return null; // Don't render label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading && !salesOverview.length && !stats.totalRevenue) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sales Overview</CardTitle>
              <Select
                value={salesView}
                onValueChange={(value: "monthly" | "yearly") =>
                  setSalesView(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly (Cumulative)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesOverview}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Bar
                  dataKey={salesView === "monthly" ? "monthly" : "yearly"}
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Motorcycle Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Motorcycle Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.motorcycleCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {stats.motorcycleCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} bikes`,
                    name,
                  ]}
                />
                <Legend
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
