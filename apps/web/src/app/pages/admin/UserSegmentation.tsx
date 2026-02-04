import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { 
  Users,
  Filter,
  Target,
  TrendingUp,
  Calendar,
  Heart,
  Zap,
  DollarSign,
  Activity,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  X,
  Mail,
  Send
} from "lucide-react";
import { useState } from "react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface Segment {
  id: string;
  name: string;
  description: string;
  userCount: number;
  criteria: {
    type: string;
    operator: string;
    value: string;
  }[];
  engagement: number;
  conversionRate: number;
  avgSessionLength: number;
  createdAt: Date;
  color: string;
}

export function UserSegmentation() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [showViewUsersModal, setShowViewUsersModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingSegment, setViewingSegment] = useState<Segment | null>(null);

  // Mock segments
  const segments: Segment[] = [
    {
      id: "seg001",
      name: "Highly Engaged Users",
      description: "Users with 10+ sessions and daily mood tracking",
      userCount: 342,
      criteria: [
        { type: "Total Sessions", operator: ">=", value: "10" },
        { type: "Mood Tracking Frequency", operator: "=", value: "Daily" },
        { type: "Last Active", operator: "<=", value: "7 days" }
      ],
      engagement: 92,
      conversionRate: 68,
      avgSessionLength: 42,
      createdAt: new Date("2024-06-01"),
      color: "#10b981"
    },
    {
      id: "seg002",
      name: "Premium Subscribers",
      description: "Active paying customers on any premium plan",
      userCount: 456,
      criteria: [
        { type: "Subscription Status", operator: "=", value: "Active" },
        { type: "Plan Type", operator: "in", value: "Premium, Professional" }
      ],
      engagement: 85,
      conversionRate: 100,
      avgSessionLength: 38,
      createdAt: new Date("2024-05-15"),
      color: "#3b82f6"
    },
    {
      id: "seg003",
      name: "At-Risk Users",
      description: "Previously active users who haven't logged in for 14+ days",
      userCount: 128,
      criteria: [
        { type: "Last Active", operator: ">", value: "14 days" },
        { type: "Total Sessions", operator: ">=", value: "5" },
        { type: "Subscription Status", operator: "=", value: "Free" }
      ],
      engagement: 12,
      conversionRate: 5,
      avgSessionLength: 8,
      createdAt: new Date("2024-06-10"),
      color: "#ef4444"
    },
    {
      id: "seg004",
      name: "New Users (0-7 days)",
      description: "Recently signed up users in onboarding phase",
      userCount: 234,
      criteria: [
        { type: "Account Age", operator: "<=", value: "7 days" },
        { type: "Onboarding Status", operator: "in", value: "In Progress, Incomplete" }
      ],
      engagement: 45,
      conversionRate: 23,
      avgSessionLength: 18,
      createdAt: new Date("2024-06-15"),
      color: "#f59e0b"
    },
    {
      id: "seg005",
      name: "Crisis Support Users",
      description: "Users who have used crisis resources in the past 30 days",
      userCount: 67,
      criteria: [
        { type: "Crisis Resource Access", operator: ">=", value: "1" },
        { type: "Last Crisis Access", operator: "<=", value: "30 days" }
      ],
      engagement: 78,
      conversionRate: 45,
      avgSessionLength: 52,
      createdAt: new Date("2024-06-05"),
      color: "#8b5cf6"
    },
    {
      id: "seg006",
      name: "Journal Enthusiasts",
      description: "Users with 20+ journal entries in the last month",
      userCount: 189,
      criteria: [
        { type: "Journal Entries (30d)", operator: ">=", value: "20" },
        { type: "Avg Words per Entry", operator: ">=", value: "100" }
      ],
      engagement: 88,
      conversionRate: 56,
      avgSessionLength: 35,
      createdAt: new Date("2024-06-12"),
      color: "#ec4899"
    }
  ];

  // Engagement distribution
  const engagementData = [
    { range: "0-20%", users: 245 },
    { range: "21-40%", users: 198 },
    { range: "41-60%", users: 312 },
    { range: "61-80%", users: 267 },
    { range: "81-100%", users: 394 }
  ];

  // Segment distribution for pie chart
  const segmentDistribution = segments.map(seg => ({
    name: seg.name,
    value: seg.userCount,
    color: seg.color
  }));

  const stats = {
    totalUsers: 1416,
    totalSegments: segments.length,
    avgEngagement: 67,
    highValueUsers: segments.find(s => s.name === "Premium Subscribers")?.userCount || 0
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
            <h1 className="text-3xl font-bold text-gray-900">User Segmentation</h1>
            <p className="text-gray-600 mt-1">Analyze and target specific user groups</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create Segment
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Segments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSegments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgEngagement}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Premium Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.highValueUsers}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Segment Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Segment Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={segmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>

          {/* Engagement Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Engagement Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px' 
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Segments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Segments</h2>

          <div className="space-y-4">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                onClick={() => setSelectedSegment(selectedSegment?.id === segment.id ? null : segment)}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  selectedSegment?.id === segment.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: segment.color }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{segment.name}</h3>
                      <span 
                        className="px-3 py-1 rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: segment.color }}
                      >
                        {segment.userCount} users
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{segment.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Engagement</p>
                        </div>
                        <p className="font-bold text-gray-900">{segment.engagement}%</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Conversion</p>
                        </div>
                        <p className="font-bold text-gray-900">{segment.conversionRate}%</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Avg Session</p>
                        </div>
                        <p className="font-bold text-gray-900">{segment.avgSessionLength}m</p>
                      </div>
                    </div>

                    {/* Criteria */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Criteria:</p>
                      <div className="space-y-1">
                        {segment.criteria.map((criterion, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Filter className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">
                              <span className="font-medium">{criterion.type}</span> {criterion.operator} <span className="font-medium">{criterion.value}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created: {segment.createdAt.toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                        onClick={() => {
                          setViewingSegment(segment);
                          setShowViewUsersModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Users
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                        onClick={() => {
                          setViewingSegment(segment);
                          setShowCampaignModal(true);
                        }}
                      >
                        <Zap className="w-4 h-4" />
                        Send Campaign
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                        onClick={() => {
                          setViewingSegment(segment);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                        onClick={() => {
                          // Download segment data as CSV
                          const csvContent = `Segment Name,User Count,Engagement,Conversion Rate,Avg Session Length\n${segment.name},${segment.userCount},${segment.engagement}%,${segment.conversionRate}%,${segment.avgSessionLength}m`;
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `segment-${segment.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Segment Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create User Segment</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Weekend Warriors"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe this user segment..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter Criteria</label>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>Total Sessions</option>
                        <option>Last Active</option>
                        <option>Subscription Status</option>
                        <option>Account Age</option>
                        <option>Mood Tracking Frequency</option>
                        <option>Journal Entries (30d)</option>
                      </select>

                      <select className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>=</option>
                        <option>≠</option>
                        <option>&gt;</option>
                        <option>&gt;=</option>
                        <option>&lt;</option>
                        <option>&lt;=</option>
                        <option>in</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Value"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Criterion
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment Color</label>
                  <div className="flex gap-2">
                    {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map(color => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                >
                  Create Segment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Users Modal */}
        {showViewUsersModal && viewingSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewUsersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Users in: {viewingSegment.name}</h3>
                  <p className="text-gray-600 mt-1">{viewingSegment.userCount} total users</p>
                </div>
                <button
                  onClick={() => setShowViewUsersModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Sarah Johnson", email: "sarah.j@example.com", status: "Active", lastActive: "2 hours ago", sessions: 24 },
                      { name: "Michael Chen", email: "m.chen@example.com", status: "Active", lastActive: "5 hours ago", sessions: 18 },
                      { name: "Emily Rodriguez", email: "emily.r@example.com", status: "Active", lastActive: "1 day ago", sessions: 32 },
                      { name: "David Kim", email: "david.k@example.com", status: "Active", lastActive: "3 hours ago", sessions: 15 },
                      { name: "Jessica Martinez", email: "j.martinez@example.com", status: "Active", lastActive: "6 hours ago", sessions: 21 },
                    ].map((user, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.lastActive}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">{user.sessions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">Showing 5 of {viewingSegment.userCount} users</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowViewUsersModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
                  >
                    View All Users
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Create Campaign Modal */}
        {showCampaignModal && viewingSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCampaignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Campaign for Segment: {viewingSegment.name}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Weekend Warriors Campaign"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe this campaign..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <p className="text-gray-600">Segment: {viewingSegment.name}</p>
                  <p className="text-gray-600">Recipients: {viewingSegment.userCount} users</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                >
                  Create Campaign
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Segment Modal */}
        {showEditModal && viewingSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit User Segment: {viewingSegment.name}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Weekend Warriors"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe this user segment..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter Criteria</label>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>Total Sessions</option>
                        <option>Last Active</option>
                        <option>Subscription Status</option>
                        <option>Account Age</option>
                        <option>Mood Tracking Frequency</option>
                        <option>Journal Entries (30d)</option>
                      </select>

                      <select className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>=</option>
                        <option>≠</option>
                        <option>&gt;</option>
                        <option>&gt;=</option>
                        <option>&lt;</option>
                        <option>&lt;=</option>
                        <option>in</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Value"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Criterion
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment Color</label>
                  <div className="flex gap-2">
                    {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map(color => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                >
                  Update Segment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayoutNew>
  );
}