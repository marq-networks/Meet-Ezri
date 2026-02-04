import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  Search
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface Transaction {
  id: string;
  user: string;
  plan: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  date: Date;
  method: string;
}

export function Billing() {
  const [timeRange, setTimeRange] = useState("30d");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleExport = () => {
    // Create CSV content
    const headers = ["Transaction ID", "User", "Plan", "Amount", "Status", "Date", "Payment Method"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(txn => [
        txn.id,
        txn.user,
        txn.plan,
        `$${txn.amount.toFixed(2)}`,
        txn.status,
        txn.date.toLocaleDateString(),
        txn.method
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Mock revenue data
  const revenueData = [
    { month: "Jan", revenue: 12500, subscriptions: 145, oneTime: 2300 },
    { month: "Feb", revenue: 15800, subscriptions: 178, oneTime: 2700 },
    { month: "Mar", revenue: 18900, subscriptions: 212, oneTime: 3100 },
    { month: "Apr", revenue: 22400, subscriptions: 245, oneTime: 3500 },
    { month: "May", revenue: 26700, subscriptions: 289, oneTime: 4200 },
    { month: "Jun", revenue: 31200, subscriptions: 334, oneTime: 4400 }
  ];

  const dailyRevenueData = [
    { day: "Mon", amount: 4200 },
    { day: "Tue", amount: 3800 },
    { day: "Wed", amount: 5100 },
    { day: "Thu", amount: 4500 },
    { day: "Fri", amount: 4800 },
    { day: "Sat", amount: 3200 },
    { day: "Sun", amount: 2900 }
  ];

  const planDistribution = [
    { name: "Premium Monthly", value: 145, color: "#3b82f6" },
    { name: "Premium Yearly", value: 189, color: "#8b5cf6" },
    { name: "Free", value: 658, color: "#10b981" },
    { name: "Trial", value: 123, color: "#f59e0b" }
  ];

  const transactions: Transaction[] = [
    {
      id: "txn001",
      user: "Sarah Johnson",
      plan: "Premium Monthly",
      amount: 29.99,
      status: "completed",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      method: "Credit Card"
    },
    {
      id: "txn002",
      user: "Michael Chen",
      plan: "Premium Yearly",
      amount: 299.99,
      status: "completed",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      method: "PayPal"
    },
    {
      id: "txn003",
      user: "Emily Rodriguez",
      plan: "Premium Monthly",
      amount: 29.99,
      status: "pending",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      method: "Credit Card"
    },
    {
      id: "txn004",
      user: "David Kim",
      plan: "Premium Yearly",
      amount: 299.99,
      status: "failed",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      method: "Credit Card"
    },
    {
      id: "txn005",
      user: "Jessica Martinez",
      plan: "Premium Monthly",
      amount: 29.99,
      status: "completed",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      method: "Apple Pay"
    },
    {
      id: "txn006",
      user: "Alex Thompson",
      plan: "Premium Monthly",
      amount: 29.99,
      status: "refunded",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      method: "Credit Card"
    }
  ];

  const filteredTransactions = transactions.filter(t => 
    filterStatus === "all" || t.status === filterStatus
  );

  const stats = {
    monthlyRevenue: 31200,
    revenueGrowth: 23.5,
    activeSubscriptions: 334,
    subscriptionGrowth: 15.6,
    averageRevenue: 93.41,
    churnRate: 2.8
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      case "refunded": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Billing & Revenue</h1>
            <p className="text-gray-600 mt-1">Financial analytics and subscription metrics</p>
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
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                <ArrowUp className="w-4 h-4" />
                {stats.revenueGrowth}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm mt-1">Monthly Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-blue-100 text-blue-700">
                <ArrowUp className="w-4 h-4" />
                {stats.subscriptionGrowth}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</h3>
            <p className="text-gray-600 text-sm mt-1">Active Subscriptions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${stats.averageRevenue}</h3>
            <p className="text-gray-600 text-sm mt-1">Avg Revenue Per User</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <ArrowDown className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                <ArrowDown className="w-4 h-4" />
                0.3%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.churnRate}%</h3>
            <p className="text-gray-600 text-sm mt-1">Churn Rate</p>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Total Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Revenue */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Revenue (This Week)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plan Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{transaction.user}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{transaction.plan}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">${transaction.amount}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{transaction.method}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {transaction.date.toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}