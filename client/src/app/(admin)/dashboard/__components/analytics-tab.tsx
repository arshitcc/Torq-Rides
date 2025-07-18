import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Jan", weekly: 12000, monthly: 45000, yearly: 180000 },
  { name: "Feb", weekly: 15000, monthly: 52000, yearly: 195000 },
  { name: "Mar", weekly: 18000, monthly: 48000, yearly: 210000 },
  { name: "Apr", weekly: 22000, monthly: 65000, yearly: 225000 },
  { name: "May", weekly: 25000, monthly: 70000, yearly: 240000 },
  { name: "Jun", weekly: 28000, monthly: 75000, yearly: 255000 },
];

export default function AnalyticsTab() {
  return (
    <>
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
                  <div className="w-24 bg.gray-200 rounded-full h-2">
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
    </>
  );
}
