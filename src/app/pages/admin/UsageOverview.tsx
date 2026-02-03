import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  Users,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Zap,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function UsageOverview() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");

  // Mock DAU/MAU/WAU Data
  const dailyActiveUsersData = [
    { date: "Jan 1", dau: 1245, mau: 3890, wau: 2340 },
    { date: "Jan 2", dau: 1320, mau: 3920, wau: 2380 },
    { date: "Jan 3", dau: 1180, mau: 3950, wau: 2420 },
    { date: "Jan 4", dau: 1450, mau: 3980, wau: 2460 },
    { date: "Jan 5", dau: 1560, mau: 4010, wau: 2500 },
    { date: "Jan 6", dau: 1380, mau: 4050, wau: 2540 },
    { date: "Jan 7", dau: 1290, mau: 4080, wau: 2580 },
    { date: "Jan 8", dau: 1470, mau: 4120, wau: 2620 },
    { date: "Jan 9", dau: 1620, mau: 4160, wau: 2660 },
    { date: "Jan 10", dau: 1550, mau: 4200, wau: 2700 },
    { date: "Jan 11", dau: 1690, mau: 4240, wau: 2740 },
    { date: "Jan 12", dau: 1780, mau: 4280, wau: 2780 },
    { date: "Jan 13", dau: 1650, mau: 4320, wau: 2820 },
    { date: "Jan 14", dau: 1540, mau: 4360, wau: 2860 },
    { date: "Jan 15", dau: 1820, mau: 4400, wau: 2900 },
  ];

  // Session Data
  const sessionData = [
    { date: "Jan 1", sessions: 2890, avgDuration: 28.5, totalMinutes: 82365 },
    { date: "Jan 2", sessions: 3120, avgDuration: 31.2, totalMinutes: 97344 },
    { date: "Jan 3", sessions: 2760, avgDuration: 27.8, totalMinutes: 76728 },
    { date: "Jan 4", sessions: 3450, avgDuration: 34.1, totalMinutes: 117645 },
    { date: "Jan 5", sessions: 3680, avgDuration: 36.3, totalMinutes: 133584 },
    { date: "Jan 6", sessions: 3240, avgDuration: 32.7, totalMinutes: 105948 },
    { date: "Jan 7", sessions: 2980, avgDuration: 29.4, totalMinutes: 87612 },
    { date: "Jan 8", sessions: 3510, avgDuration: 35.6, totalMinutes: 124956 },
    { date: "Jan 9", sessions: 3820, avgDuration: 38.9, totalMinutes: 148598 },
    { date: "Jan 10", sessions: 3670, avgDuration: 36.2, totalMinutes: 132854 },
    { date: "Jan 11", sessions: 3990, avgDuration: 39.8, totalMinutes: 158802 },
    { date: "Jan 12", sessions: 4180, avgDuration: 41.2, totalMinutes: 172216 },
    { date: "Jan 13", sessions: 3850, avgDuration: 37.9, totalMinutes: 145915 },
    { date: "Jan 14", sessions: 3620, avgDuration: 35.4, totalMinutes: 128148 },
    { date: "Jan 15", sessions: 4250, avgDuration: 42.8, totalMinutes: 181900 },
  ];

  // Peak Usage Hours
  const peakUsageData = [
    { hour: "12 AM", users: 120 },
    { hour: "1 AM", users: 85 },
    { hour: "2 AM", users: 65 },
    { hour: "3 AM", users: 45 },
    { hour: "4 AM", users: 38 },
    { hour: "5 AM", users: 52 },
    { hour: "6 AM", users: 145 },
    { hour: "7 AM", users: 289 },
    { hour: "8 AM", users: 456 },
    { hour: "9 AM", users: 678 },
    { hour: "10 AM", users: 789 },
    { hour: "11 AM", users: 856 },
    { hour: "12 PM", users: 923 },
    { hour: "1 PM", users: 845 },
    { hour: "2 PM", users: 756 },
    { hour: "3 PM", users: 698 },
    { hour: "4 PM", users: 734 },
    { hour: "5 PM", users: 812 },
    { hour: "6 PM", users: 945 },
    { hour: "7 PM", users: 1123 },
    { hour: "8 PM", users: 1256 },
    { hour: "9 PM", users: 1189 },
    { hour: "10 PM", users: 945 },
    { hour: "11 PM", users: 567 },
  ];

  // User Activity Distribution
  const activityDistribution = [
    { name: "Power Users (>10 sessions/week)", value: 456, color: "#8b5cf6" },
    { name: "Active Users (5-10 sessions/week)", value: 1234, color: "#3b82f6" },
    { name: "Regular Users (2-4 sessions/week)", value: 2345, color: "#10b981" },
    { name: "Casual Users (1 session/week)", value: 890, color: "#f59e0b" },
    { name: "Inactive (no sessions this week)", value: 456, color: "#6b7280" },
  ];

  const stats = [
    {
      label: "Daily Active Users",
      value: "1,820",
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      description: "vs last period",
    },
    {
      label: "Total Sessions Today",
      value: "4,250",
      change: "+8.3%",
      trend: "up" as const,
      icon: Activity,
      color: "from-purple-500 to-pink-600",
      description: "sessions started",
    },
    {
      label: "Total Minutes Consumed",
      value: "181,900",
      change: "+15.7%",
      trend: "up" as const,
      icon: Clock,
      color: "from-green-500 to-emerald-600",
      description: "therapy minutes",
    },
    {
      label: "Avg Session Duration",
      value: "42.8 min",
      change: "+3.2%",
      trend: "up" as const,
      icon: Target,
      color: "from-orange-500 to-red-600",
      description: "per session",
    },
  ];

  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#6b7280"];

  return (
    <AdminLayoutNew>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Usage Overview</h1>
            <p className="text-gray-600">
              Daily active users, sessions, and minutes consumed
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 border border-gray-200">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold !text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm !text-gray-600">{stat.label}</p>
                <p className="text-xs !text-gray-500 mt-1">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* DAU/MAU/WAU Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold !text-gray-900 mb-1">
                  Active Users Trend
                </h3>
                <p className="text-sm !text-gray-600">
                  Daily, Weekly, and Monthly Active Users
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dailyActiveUsersData}>
                <defs>
                  <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="dau"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorDAU)"
                  name="Daily Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="wau"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorWAU)"
                  name="Weekly Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="mau"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorMAU)"
                  name="Monthly Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Sessions & Minutes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold !text-gray-900 mb-1">
                    Total Sessions
                  </h3>
                  <p className="text-sm !text-gray-600">Sessions started per day</p>
                </div>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="sessions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Minutes Consumed Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold !text-gray-900 mb-1">
                    Minutes Consumed
                  </h3>
                  <p className="text-sm !text-gray-600">Total therapy minutes</p>
                </div>
                <Clock className="w-5 h-5 text-green-600" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalMinutes"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Peak Usage Hours & Activity Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Usage Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold !text-gray-900 mb-1">
                    Peak Usage Hours
                  </h3>
                  <p className="text-sm !text-gray-600">Active users by hour</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={peakUsageData}>
                  <defs>
                    <linearGradient id="colorHour" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorHour)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Activity Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold !text-gray-900 mb-1">
                    User Activity Distribution
                  </h3>
                  <p className="text-sm !text-gray-600">Users by engagement level</p>
                </div>
                <PieChart className="w-5 h-5 text-pink-600" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayoutNew>
  );
}