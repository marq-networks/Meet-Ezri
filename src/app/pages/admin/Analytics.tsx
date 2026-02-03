import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

export function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for charts
  const userGrowthData = [
    { date: "Week 1", users: 120, active: 98, premium: 12 },
    { date: "Week 2", users: 245, active: 189, premium: 28 },
    { date: "Week 3", users: 398, active: 312, premium: 45 },
    { date: "Week 4", users: 521, active: 423, premium: 67 },
    { date: "Week 5", users: 689, active: 556, premium: 89 },
    { date: "Week 6", users: 834, active: 678, premium: 112 },
    { date: "Week 7", users: 1024, active: 845, premium: 145 },
    { date: "Week 8", users: 1205, active: 987, premium: 178 }
  ];

  const sessionData = [
    { day: "Mon", sessions: 245, duration: 28 },
    { day: "Tue", sessions: 312, duration: 32 },
    { day: "Wed", sessions: 289, duration: 27 },
    { day: "Thu", sessions: 356, duration: 35 },
    { day: "Fri", sessions: 298, duration: 29 },
    { day: "Sat", sessions: 234, duration: 31 },
    { day: "Sun", sessions: 198, duration: 26 }
  ];

  const userTypeData = [
    { name: "Free", value: 658, color: "#3b82f6" },
    { name: "Premium", value: 345, color: "#8b5cf6" },
    { name: "Trial", value: 123, color: "#10b981" },
    { name: "Inactive", value: 79, color: "#6b7280" }
  ];

  const featureUsageData = [
    { feature: "AI Sessions", usage: 89 },
    { feature: "Mood Tracking", usage: 95 },
    { feature: "Journal", usage: 67 },
    { feature: "Sleep Tracker", usage: 54 },
    { feature: "Habit Tracker", usage: 62 },
    { feature: "Wellness Tools", usage: 73 },
    { feature: "Crisis Resources", usage: 23 }
  ];

  const revenueData = [
    { month: "Jan", revenue: 12500, recurring: 10200, oneTime: 2300 },
    { month: "Feb", revenue: 15800, recurring: 13100, oneTime: 2700 },
    { month: "Mar", revenue: 18900, recurring: 15800, oneTime: 3100 },
    { month: "Apr", revenue: 22400, recurring: 18900, oneTime: 3500 },
    { month: "May", revenue: 26700, recurring: 22500, oneTime: 4200 },
    { month: "Jun", revenue: 31200, recurring: 26800, oneTime: 4400 }
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: "$127,500",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600"
    },
    {
      label: "Active Users",
      value: "1,205",
      change: "+18.2%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-indigo-600"
    },
    {
      label: "Avg Engagement",
      value: "82%",
      change: "+5.7%",
      trend: "up",
      icon: Activity,
      color: "from-purple-500 to-pink-600"
    },
    {
      label: "Conversion Rate",
      value: "14.8%",
      change: "-2.1%",
      trend: "down",
      icon: Target,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <AdminLayoutNew>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                    stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
              <p className="text-gray-600 text-sm mt-1">Total, active, and premium users over time</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="Total Users" />
              <Area type="monotone" dataKey="active" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
              <Area type="monotone" dataKey="premium" stroke="#10b981" fillOpacity={1} fill="url(#colorPremium)" name="Premium Users" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Session Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Sessions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Sessions" />
                <Bar dataKey="duration" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Avg Duration (min)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Types Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Feature Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Feature Usage Rate</h2>
          <div className="space-y-4">
            {featureUsageData.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">{item.feature}</span>
                  <span className="text-gray-900 font-bold">{item.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.usage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Breakdown</h2>
              <p className="text-gray-600 text-sm mt-1">Monthly recurring vs one-time revenue</p>
            </div>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Total Revenue" />
              <Line type="monotone" dataKey="recurring" stroke="#3b82f6" strokeWidth={2} name="Recurring" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="oneTime" stroke="#8b5cf6" strokeWidth={2} name="One-time" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}