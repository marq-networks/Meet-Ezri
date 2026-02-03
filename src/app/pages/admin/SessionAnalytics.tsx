import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { StatsCard } from "../../components/StatsCard";
import { motion } from "motion/react";
import {
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function SessionAnalytics() {
  const sessionTrendData = [
    { date: "Mon", sessions: 145 },
    { date: "Tue", sessions: 178 },
    { date: "Wed", sessions: 156 },
    { date: "Thu", sessions: 203 },
    { date: "Fri", sessions: 189 },
    { date: "Sat", sessions: 167 },
    { date: "Sun", sessions: 142 },
  ];

  const avatarUsageData = [
    { name: "Serena (Empathetic)", value: 35, color: "#9b87f5" },
    { name: "Marcus (Direct)", value: 28, color: "#7c3aed" },
    { name: "Luna (Calm)", value: 22, color: "#d946ef" },
    { name: "Alex (Balanced)", value: 15, color: "#0ea5e9" },
  ];

  const topicDistributionData = [
    { topic: "Anxiety", count: 342 },
    { topic: "Depression", count: 298 },
    { topic: "Sleep", count: 234 },
    { topic: "Relationships", count: 189 },
    { topic: "Stress", count: 167 },
    { topic: "Self-esteem", count: 145 },
  ];

  const sessionDurationData = [
    { range: "0-15 min", count: 89 },
    { range: "15-30 min", count: 234 },
    { range: "30-45 min", count: 456 },
    { range: "45-60 min", count: 312 },
    { range: "60+ min", count: 123 },
  ];

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Session Analytics</h1>
          <p className="text-muted-foreground">
            Monitor AI session usage patterns and metrics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Sessions"
            value="18,459"
            change="+12.5%"
            changeType="positive"
            icon={MessageSquare}
            color="primary"
            delay={0}
          />
          <StatsCard
            title="Avg Duration"
            value="42 min"
            change="+5 min"
            changeType="positive"
            icon={Clock}
            color="secondary"
            delay={0.1}
          />
          <StatsCard
            title="Active Users"
            value="3,284"
            change="+8.3%"
            changeType="positive"
            icon={Users}
            color="accent"
            delay={0.2}
          />
          <StatsCard
            title="Sessions This Week"
            value="1,284"
            change="+15.7%"
            changeType="positive"
            icon={TrendingUp}
            color="success"
            delay={0.3}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Session Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Session Trend (7 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#9b87f5"
                    strokeWidth={3}
                    dot={{ fill: "#9b87f5", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Avatar Usage */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Avatar Preferences</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={avatarUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {avatarUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Topic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Popular Topics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topicDistributionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="topic" type="category" stroke="#6b7280" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#9b87f5" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Session Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Session Duration Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionDurationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Recent Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Recent Sessions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avatar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Sentiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      user: "Emily R.",
                      avatar: "Serena",
                      topic: "Anxiety",
                      duration: "45 min",
                      sentiment: "Positive",
                      time: "10 min ago",
                    },
                    {
                      user: "Michael T.",
                      avatar: "Marcus",
                      topic: "Sleep",
                      duration: "32 min",
                      sentiment: "Neutral",
                      time: "25 min ago",
                    },
                    {
                      user: "Sarah M.",
                      avatar: "Luna",
                      topic: "Depression",
                      duration: "58 min",
                      sentiment: "Improved",
                      time: "1 hour ago",
                    },
                  ].map((session, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                            {session.user.charAt(0)}
                          </div>
                          <span className="font-medium text-sm">{session.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {session.avatar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {session.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {session.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            session.sentiment === "Positive"
                              ? "bg-green-100 text-green-700"
                              : session.sentiment === "Improved"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {session.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {session.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}