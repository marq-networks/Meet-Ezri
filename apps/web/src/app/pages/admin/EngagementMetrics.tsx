import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Users,
  Activity,
  BookOpen,
  Smile,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function EngagementMetrics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Engagement Score Trend
  const engagementTrendData = [
    { date: "Week 1", score: 72, sessions: 2890, journalEntries: 456 },
    { date: "Week 2", score: 75, sessions: 3120, journalEntries: 523 },
    { date: "Week 3", score: 78, sessions: 3350, journalEntries: 598 },
    { date: "Week 4", score: 82, sessions: 3680, journalEntries: 645 },
    { date: "Week 5", score: 85, sessions: 3990, journalEntries: 712 },
    { date: "Week 6", score: 83, sessions: 3850, journalEntries: 689 },
    { date: "Week 7", score: 87, sessions: 4180, journalEntries: 756 },
    { date: "Week 8", score: 89, sessions: 4420, journalEntries: 823 },
  ];

  // Session Frequency Analysis
  const sessionFrequencyData = [
    { range: "1-2 times/week", users: 890, percentage: 18 },
    { range: "3-4 times/week", users: 1456, percentage: 29 },
    { range: "5-6 times/week", users: 1823, percentage: 37 },
    { range: "Daily (7+)", users: 812, percentage: 16 },
  ];

  // Feature Engagement
  const featureEngagementData = [
    { feature: "AI Sessions", usage: 95, satisfaction: 4.8 },
    { feature: "Mood Tracking", usage: 89, satisfaction: 4.6 },
    { feature: "Journaling", usage: 72, satisfaction: 4.7 },
    { feature: "Wellness Tools", usage: 68, satisfaction: 4.5 },
    { feature: "Progress Reports", usage: 54, satisfaction: 4.3 },
    { feature: "Community", usage: 42, satisfaction: 4.2 },
  ];

  // User Journey Engagement
  const userJourneyData = [
    { stage: "Onboarding", completion: 92, dropoff: 8 },
    { stage: "First Session", completion: 87, dropoff: 5 },
    { stage: "Week 1", completion: 78, dropoff: 9 },
    { stage: "Week 2", completion: 71, dropoff: 7 },
    { stage: "Month 1", completion: 64, dropoff: 7 },
    { stage: "Month 2", completion: 58, dropoff: 6 },
    { stage: "Month 3+", completion: 53, dropoff: 5 },
  ];

  // Return Rate Data
  const returnRateData = [
    { day: "Day 1", rate: 95 },
    { day: "Day 2", rate: 88 },
    { day: "Day 3", rate: 82 },
    { day: "Day 7", rate: 76 },
    { day: "Day 14", rate: 68 },
    { day: "Day 30", rate: 61 },
    { day: "Day 60", rate: 54 },
    { day: "Day 90", rate: 49 },
  ];

  // Engagement by Time of Day
  const timeOfDayEngagement = [
    { time: "Morning (6-12)", engagement: 78, sessions: 1234 },
    { time: "Afternoon (12-6)", engagement: 85, sessions: 1890 },
    { time: "Evening (6-10)", engagement: 92, sessions: 2456 },
    { time: "Night (10-6)", engagement: 62, sessions: 567 },
  ];

  const stats = [
    {
      label: "Overall Engagement Score",
      value: "89%",
      change: "+2.3%",
      trend: "up" as const,
      icon: Heart,
      color: "from-pink-500 to-rose-600",
      description: "vs last period",
    },
    {
      label: "Avg Session Frequency",
      value: "4.8x/week",
      change: "+0.5x",
      trend: "up" as const,
      icon: Activity,
      color: "from-purple-500 to-indigo-600",
      description: "per user",
    },
    {
      label: "Feature Adoption Rate",
      value: "76%",
      change: "+4.2%",
      trend: "up" as const,
      icon: Zap,
      color: "from-cyan-500 to-blue-600",
      description: "of all features",
    },
    {
      label: "7-Day Return Rate",
      value: "76%",
      change: "-1.8%",
      trend: "down" as const,
      icon: Target,
      color: "from-orange-500 to-red-600",
      description: "users returning",
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
              Engagement Metrics
            </h1>
            <p className="text-gray-600">
              User engagement scores, session frequency, and behavioral insights
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

            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

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
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-700">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Engagement Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Engagement Score Trend
                </h3>
                <p className="text-sm text-gray-400">
                  Overall engagement with sessions and journal entries
                </p>
              </div>
              <Heart className="w-5 h-5 text-pink-400" />
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={engagementTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
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
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  name="Engagement Score"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sessions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="journalEntries"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Journal Entries"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Session Frequency & Feature Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Frequency */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Session Frequency Analysis
                  </h3>
                  <p className="text-sm text-gray-400">Users by sessions per week</p>
                </div>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionFrequencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="range" type="category" stroke="#9ca3af" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="users" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {sessionFrequencyData.map((entry, index) => (
                      <text
                        key={index}
                        x={entry.users + 50}
                        y={0}
                        fill="#fff"
                        textAnchor="start"
                      >
                        {entry.percentage}%
                      </text>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Feature Engagement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Feature Engagement
                  </h3>
                  <p className="text-sm text-gray-400">Usage % and satisfaction</p>
                </div>
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="space-y-4">
                {featureEngagementData.map((feature, index) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{feature.feature}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">
                          {feature.usage}% usage
                        </span>
                        <div className="flex items-center gap-1">
                          <Smile className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white font-medium">
                            {feature.satisfaction}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${feature.usage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* User Journey & Return Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Journey Drop-off */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    User Journey Engagement
                  </h3>
                  <p className="text-sm text-gray-400">Completion and drop-off rates</p>
                </div>
                <Target className="w-5 h-5 text-orange-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userJourneyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="stage" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
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
                  <Bar dataKey="completion" stackId="a" fill="#10b981" name="Completion %" />
                  <Bar dataKey="dropoff" stackId="a" fill="#ef4444" name="Drop-off %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Return Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Return Rate Trend</h3>
                  <p className="text-sm text-gray-400">
                    % of users returning over time
                  </p>
                </div>
                <Users className="w-5 h-5 text-green-400" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={returnRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
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
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Time of Day Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Engagement by Time of Day
                </h3>
                <p className="text-sm text-gray-400">
                  Engagement scores and session volume
                </p>
              </div>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={timeOfDayEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="sessions"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Sessions"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#ec4899"
                  strokeWidth={3}
                  name="Engagement %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}