import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  CheckCircle,
  Users,
  Bell,
  Target,
  Award,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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

export function NudgePerformance() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Overall Performance Trend
  const performanceTrend = [
    { date: "Week 1", sent: 12450, opened: 9960, clicked: 6225, converted: 4980 },
    { date: "Week 2", sent: 15230, opened: 12184, clicked: 7615, converted: 6092 },
    { date: "Week 3", sent: 18900, opened: 15120, clicked: 9450, converted: 7560 },
    { date: "Week 4", sent: 21340, opened: 17072, clicked: 10670, converted: 8536 },
  ];

  // Campaign Performance Comparison
  const campaignPerformance = [
    {
      name: "Morning Mood Check-in",
      sent: 8640,
      opened: 6912,
      clicked: 4320,
      converted: 3456,
      openRate: 80,
      clickRate: 50,
      conversionRate: 40,
    },
    {
      name: "Post-Session Follow-up",
      sent: 2340,
      opened: 2106,
      clicked: 1638,
      converted: 1404,
      openRate: 90,
      clickRate: 70,
      conversionRate: 60,
    },
    {
      name: "Evening Wind-down",
      sent: 5670,
      opened: 4536,
      clicked: 3402,
      converted: 2835,
      openRate: 80,
      clickRate: 60,
      conversionRate: 50,
    },
    {
      name: "7-Day Re-engagement",
      sent: 468,
      opened: 281,
      clicked: 140,
      converted: 94,
      openRate: 60,
      clickRate: 30,
      conversionRate: 20,
    },
  ];

  // Channel Performance
  const channelData = [
    { name: "Push Notification", value: 45, count: 12450, color: "#3b82f6" },
    { name: "Email", value: 30, count: 8300, color: "#10b981" },
    { name: "In-App", value: 20, count: 5533, color: "#f59e0b" },
    { name: "SMS", value: 5, count: 1383, color: "#ec4899" },
  ];

  // Time-of-Day Performance
  const timePerformance = [
    { time: "6AM", openRate: 65, clickRate: 35 },
    { time: "9AM", openRate: 85, clickRate: 55 },
    { time: "12PM", openRate: 75, clickRate: 45 },
    { time: "3PM", openRate: 70, clickRate: 40 },
    { time: "6PM", openRate: 80, clickRate: 50 },
    { time: "9PM", openRate: 82, clickRate: 52 },
  ];

  // A/B Test Results
  const abTestResults = [
    {
      campaign: "Morning Mood Check-in",
      variantA: { name: "Original", sent: 4320, opened: 3456, clicked: 2160 },
      variantB: { name: "Emoji Version", sent: 4320, opened: 3802, clicked: 2592 },
      winner: "B",
    },
  ];

  // Top Performing Templates
  const topTemplates = [
    {
      id: "1",
      name: "Session Completion Celebration",
      sent: 2340,
      openRate: 90,
      clickRate: 70,
      conversionRate: 60,
    },
    {
      id: "2",
      name: "Evening Wind-down",
      sent: 5670,
      openRate: 80,
      clickRate: 60,
      conversionRate: 50,
    },
    {
      id: "3",
      name: "Morning Mood Check-in",
      sent: 8640,
      openRate: 80,
      clickRate: 50,
      conversionRate: 40,
    },
    {
      id: "4",
      name: "Streak Milestone",
      sent: 1035,
      openRate: 90,
      clickRate: 80,
      conversionRate: 70,
    },
  ];

  const stats = [
    {
      label: "Total Sent",
      value: "67,920",
      change: "+18.5%",
      trend: "up" as const,
      icon: Bell,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Avg Open Rate",
      value: "80.2%",
      change: "+5.3%",
      trend: "up" as const,
      icon: Eye,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Avg Click Rate",
      value: "51.8%",
      change: "+3.7%",
      trend: "up" as const,
      icon: MousePointer,
      color: "from-orange-500 to-amber-600",
    },
    {
      label: "Conversion Rate",
      value: "42.1%",
      change: "+2.4%",
      trend: "up" as const,
      icon: Target,
      color: "from-purple-500 to-pink-600",
    },
  ];

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nudge Performance
            </h1>
            <p className="text-gray-600">
              Campaign analytics and engagement metrics
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
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>

            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              onClick={() => {
                // Generate CSV data
                const csvContent = [
                  ["Metric", "Value"],
                  ["Total Sent", "67,920"],
                  ["Avg Open Rate", "80.2%"],
                  ["Avg Click Rate", "51.8%"],
                  ["Conversion Rate", "42.1%"],
                  [""],
                  ["Campaign Performance"],
                  ["Campaign", "Sent", "Open Rate", "Click Rate", "Conversion Rate"],
                  ...campaignPerformance.map(c => [
                    c.name,
                    c.sent.toString(),
                    `${c.openRate}%`,
                    `${c.clickRate}%`,
                    `${c.conversionRate}%`
                  ])
                ].map(row => row.join(",")).join("\n");

                // Create download link
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nudge-performance-report-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => window.location.reload()}
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
              <Card className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                      stat.trend === "up"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
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
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Performance Funnel Trend
                </h3>
                <p className="text-sm text-gray-400">
                  Sent, opened, clicked, and converted over time
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClicked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                  dataKey="sent"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSent)"
                  name="Sent"
                />
                <Area
                  type="monotone"
                  dataKey="opened"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorOpened)"
                  name="Opened"
                />
                <Area
                  type="monotone"
                  dataKey="clicked"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorClicked)"
                  name="Clicked"
                />
                <Area
                  type="monotone"
                  dataKey="converted"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorConverted)"
                  name="Converted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Campaign Comparison & Channel Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Campaign Comparison
                  </h3>
                  <p className="text-sm text-gray-400">Open rates by campaign</p>
                </div>
                <Target className="w-5 h-5 text-purple-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="openRate" fill="#10b981" radius={[0, 8, 8, 0]} name="Open Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Channel Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Channel Distribution
                  </h3>
                  <p className="text-sm text-gray-400">Messages by channel</p>
                </div>
                <Bell className="w-5 h-5 text-blue-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
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
                </RechartsPie>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {channelData.map((channel) => (
                  <div key={channel.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="text-sm text-gray-400">
                      {channel.name}: {channel.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Top Performing Templates & Time Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Top Performing Templates
                  </h3>
                  <p className="text-sm text-gray-400">Best engagement rates</p>
                </div>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="space-y-4">
                {topTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <span className="text-2xl font-bold text-purple-400">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {template.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>{template.sent.toLocaleString()} sent</span>
                        <span>{template.openRate}% open</span>
                        <span>{template.clickRate}% click</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {template.conversionRate}%
                      </p>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Time-of-Day Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Time-of-Day Performance
                  </h3>
                  <p className="text-sm text-gray-400">Best sending times</p>
                </div>
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
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
                  <Line
                    type="monotone"
                    dataKey="openRate"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 6 }}
                    name="Open Rate %"
                  />
                  <Line
                    type="monotone"
                    dataKey="clickRate"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", r: 6 }}
                    name="Click Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* A/B Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  A/B Test Results
                </h3>
                <p className="text-sm text-gray-400">Active experiment outcomes</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>

            {abTestResults.map((test) => {
              const variantAOpenRate = (
                (test.variantA.opened / test.variantA.sent) *
                100
              ).toFixed(1);
              const variantBOpenRate = (
                (test.variantB.opened / test.variantB.sent) *
                100
              ).toFixed(1);
              const variantAClickRate = (
                (test.variantA.clicked / test.variantA.sent) *
                100
              ).toFixed(1);
              const variantBClickRate = (
                (test.variantB.clicked / test.variantB.sent) *
                100
              ).toFixed(1);

              return (
                <div key={test.campaign}>
                  <h4 className="text-lg font-bold text-white mb-4">
                    {test.campaign}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Variant A */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white font-medium">
                          Variant A: {test.variantA.name}
                        </h5>
                        {test.winner === "A" && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Sent</p>
                          <p className="text-lg font-bold text-white">
                            {test.variantA.sent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Open Rate</p>
                          <p className="text-lg font-bold text-white">
                            {variantAOpenRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Click Rate</p>
                          <p className="text-lg font-bold text-white">
                            {variantAClickRate}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Variant B */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white font-medium">
                          Variant B: {test.variantB.name}
                        </h5>
                        {test.winner === "B" && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Sent</p>
                          <p className="text-lg font-bold text-white">
                            {test.variantB.sent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Open Rate</p>
                          <p className="text-lg font-bold text-white">
                            {variantBOpenRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Click Rate</p>
                          <p className="text-lg font-bold text-white">
                            {variantBClickRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}