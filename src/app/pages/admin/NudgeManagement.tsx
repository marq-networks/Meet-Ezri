import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AnimatePresence } from "motion/react";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Users,
  Clock,
  Target,
  Search,
  Filter,
  Calendar,
  MessageSquare,
  TrendingUp,
  Eye,
  Send,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  X,
  Save,
  Upload,
  FileText,
} from "lucide-react";

interface Nudge {
  id: number;
  title: string;
  message: string;
  type: "motivational" | "reminder" | "milestone" | "wellness-tip" | "check-in";
  status: "active" | "draft" | "paused";
  trigger: string;
  targetAudience: string;
  schedule: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdDate: string;
  lastSent?: string;
}

export function NudgeManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNudge, setSelectedNudge] = useState<Nudge | null>(null);
  
  // Modal states
  const [viewModalNudge, setViewModalNudge] = useState<Nudge | null>(null);
  const [editModalNudge, setEditModalNudge] = useState<Nudge | null>(null);
  const [deleteModalNudge, setDeleteModalNudge] = useState<Nudge | null>(null);
  const [analyticsModalNudge, setAnalyticsModalNudge] = useState<Nudge | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);

  const nudges: Nudge[] = [
    {
      id: 1,
      title: "Morning Wellness Check-in",
      message: "Good morning! 🌅 How are you feeling today? Take a moment to check in with yourself.",
      type: "check-in",
      status: "active",
      trigger: "Daily at 8:00 AM",
      targetAudience: "All active users",
      schedule: "Daily",
      sentCount: 12456,
      openRate: 78.5,
      clickRate: 45.2,
      createdDate: "Dec 15, 2024",
      lastSent: "Today at 8:00 AM",
    },
    {
      id: 2,
      title: "Session Reminder",
      message: "You haven't had a session in 3 days. Your mental health matters - let's chat! 💙",
      type: "reminder",
      status: "active",
      trigger: "3 days after last session",
      targetAudience: "Inactive users (3+ days)",
      schedule: "Triggered",
      sentCount: 3421,
      openRate: 65.3,
      clickRate: 38.7,
      createdDate: "Dec 10, 2024",
      lastSent: "2 hours ago",
    },
    {
      id: 3,
      title: "Milestone Celebration",
      message: "🎉 Congratulations! You've completed 10 sessions. You're doing amazing work!",
      type: "milestone",
      status: "active",
      trigger: "10 sessions completed",
      targetAudience: "Users reaching milestones",
      schedule: "Triggered",
      sentCount: 892,
      openRate: 89.4,
      clickRate: 67.3,
      createdDate: "Dec 1, 2024",
      lastSent: "1 hour ago",
    },
    {
      id: 4,
      title: "Evening Reflection",
      message: "Take a moment to reflect on your day. What are you grateful for? 🌙",
      type: "wellness-tip",
      status: "active",
      trigger: "Daily at 8:00 PM",
      targetAudience: "All active users",
      schedule: "Daily",
      sentCount: 11234,
      openRate: 72.1,
      clickRate: 41.8,
      createdDate: "Nov 28, 2024",
      lastSent: "Yesterday at 8:00 PM",
    },
    {
      id: 5,
      title: "Breathing Exercise Reminder",
      message: "Feeling stressed? Try our 5-minute breathing exercise to calm your mind. 🧘‍♀️",
      type: "wellness-tip",
      status: "active",
      trigger: "High stress detected",
      targetAudience: "Users with low mood scores",
      schedule: "Triggered",
      sentCount: 2156,
      openRate: 82.6,
      clickRate: 59.4,
      createdDate: "Nov 20, 2024",
      lastSent: "3 hours ago",
    },
    {
      id: 6,
      title: "Weekly Progress Summary",
      message: "Your weekly progress is ready! 📊 See how you've grown this week.",
      type: "motivational",
      status: "draft",
      trigger: "Every Monday at 9:00 AM",
      targetAudience: "All active users",
      schedule: "Weekly",
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: "Dec 20, 2024",
    },
    {
      id: 7,
      title: "Mood Journal Prompt",
      message: "How's your mood today? Writing can help you process your feelings. ✍️",
      type: "check-in",
      status: "paused",
      trigger: "Daily at 6:00 PM",
      targetAudience: "Users with journaling enabled",
      schedule: "Daily",
      sentCount: 5678,
      openRate: 71.3,
      clickRate: 43.9,
      createdDate: "Nov 15, 2024",
      lastSent: "Dec 25, 2024",
    },
    {
      id: 8,
      title: "Sleep Quality Check",
      message: "Better sleep = better mental health. Track your sleep tonight! 😴",
      type: "wellness-tip",
      status: "active",
      trigger: "Daily at 9:00 PM",
      targetAudience: "Users with sleep tracking enabled",
      schedule: "Daily",
      sentCount: 8923,
      openRate: 76.8,
      clickRate: 52.1,
      createdDate: "Nov 10, 2024",
      lastSent: "Yesterday at 9:00 PM",
    },
  ];

  const filteredNudges = nudges.filter((nudge) => {
    const matchesSearch =
      nudge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nudge.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || nudge.type === filterType;
    const matchesStatus = filterStatus === "all" || nudge.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: nudges.length,
    active: nudges.filter((n) => n.status === "active").length,
    draft: nudges.filter((n) => n.status === "draft").length,
    paused: nudges.filter((n) => n.status === "paused").length,
    totalSent: nudges.reduce((sum, n) => sum + n.sentCount, 0),
    avgOpenRate: (nudges.reduce((sum, n) => sum + n.openRate, 0) / nudges.length).toFixed(1),
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "motivational":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "reminder":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "milestone":
        return "bg-green-100 text-green-700 border-green-300";
      case "wellness-tip":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "check-in":
        return "bg-pink-100 text-pink-700 border-pink-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Nudge Management</h1>
                <p className="text-muted-foreground">
                  Create and manage motivational messages and reminders
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setShowImportModal(true)}>
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setShowCreateTemplateModal(true)}>
                <FileText className="w-4 h-4" />
                Create Template
              </Button>
              <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create Nudge
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Nudges</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Draft</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                </div>
                <Edit className="w-8 h-8 text-gray-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Paused</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.paused}</p>
                </div>
                <Pause className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(stats.totalSent / 1000).toFixed(1)}K
                  </p>
                </div>
                <Send className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgOpenRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search nudges..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="motivational">Motivational</option>
                  <option value="reminder">Reminder</option>
                  <option value="milestone">Milestone</option>
                  <option value="wellness-tip">Wellness Tip</option>
                  <option value="check-in">Check-in</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Nudges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNudges.map((nudge, index) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{nudge.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(nudge.status)}`}>
                        {nudge.status}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(nudge.type)}`}>
                      {nudge.type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setViewModalNudge(nudge)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditModalNudge(nudge)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      alert(`Copied: ${nudge.title}`);
                    }}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{nudge.message}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Trigger</p>
                    <p className="font-medium">{nudge.trigger}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Schedule</p>
                    <p className="font-medium">{nudge.schedule}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Target Audience</p>
                    <p className="font-medium">{nudge.targetAudience}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">{nudge.createdDate}</p>
                  </div>
                </div>

                {/* Stats */}
                {nudge.status !== "draft" && (
                  <div className="border-t pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{nudge.sentCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{nudge.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{nudge.clickRate}%</p>
                        <p className="text-xs text-muted-foreground">Click Rate</p>
                      </div>
                    </div>
                  </div>
                )}

                {nudge.lastSent && (
                  <p className="text-xs text-muted-foreground mb-4">
                    Last sent: {nudge.lastSent}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {nudge.status === "active" && (
                    <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => alert(`Paused: ${nudge.title}`)}>
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  {nudge.status === "paused" && (
                    <Button size="sm" className="flex-1 gap-2" onClick={() => alert(`Activated: ${nudge.title}`)}>
                      <Play className="w-4 h-4" />
                      Activate
                    </Button>
                  )}
                  {nudge.status === "draft" && (
                    <Button size="sm" className="flex-1 gap-2" onClick={() => alert(`Published: ${nudge.title}`)}>
                      <Send className="w-4 h-4" />
                      Publish
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => setAnalyticsModalNudge(nudge)}>
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteModalNudge(nudge)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNudges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">No Nudges Found</h3>
            <p className="text-muted-foreground mb-4">
              No nudges match the current filters
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Nudge
            </Button>
          </motion.div>
        )}

        {/* Create Modal Placeholder */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create New Nudge</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nudge Title</label>
                    <Input placeholder="Enter nudge title..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full p-3 border rounded-lg"
                      rows={4}
                      placeholder="Enter your message..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Motivational</option>
                        <option>Reminder</option>
                        <option>Milestone</option>
                        <option>Wellness Tip</option>
                        <option>Check-in</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Schedule</label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Triggered</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <Input placeholder="e.g., All active users" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1">
                      Create Nudge
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {viewModalNudge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setViewModalNudge(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">View Nudge</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(viewModalNudge.status)}`}>
                      {viewModalNudge.status}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setViewModalNudge(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
                    <p className="text-lg font-semibold">{viewModalNudge.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p>{viewModalNudge.message}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(viewModalNudge.type)}`}>
                        {viewModalNudge.type.replace("-", " ")}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Schedule</label>
                      <p className="font-medium">{viewModalNudge.schedule}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Trigger</label>
                    <p className="font-medium">{viewModalNudge.trigger}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Target Audience</label>
                    <p className="font-medium">{viewModalNudge.targetAudience}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Created</label>
                    <p className="font-medium">{viewModalNudge.createdDate}</p>
                  </div>
                  
                  {viewModalNudge.status !== "draft" && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-3">Performance</label>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{viewModalNudge.sentCount.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Sent</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{viewModalNudge.openRate}%</p>
                          <p className="text-xs text-gray-600">Open Rate</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{viewModalNudge.clickRate}%</p>
                          <p className="text-xs text-gray-600">Click Rate</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setViewModalNudge(null)}>
                      Close
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      setEditModalNudge(viewModalNudge);
                      setViewModalNudge(null);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editModalNudge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditModalNudge(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Edit Nudge</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditModalNudge(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nudge Title</label>
                    <Input defaultValue={editModalNudge.title} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full p-3 border rounded-lg"
                      rows={4}
                      defaultValue={editModalNudge.message}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalNudge.type}>
                        <option value="motivational">Motivational</option>
                        <option value="reminder">Reminder</option>
                        <option value="milestone">Milestone</option>
                        <option value="wellness-tip">Wellness Tip</option>
                        <option value="check-in">Check-in</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalNudge.status}>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Trigger</label>
                    <Input defaultValue={editModalNudge.trigger} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Schedule</label>
                    <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalNudge.schedule}>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Triggered</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <Input defaultValue={editModalNudge.targetAudience} />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setEditModalNudge(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      alert(`Saved changes to: ${editModalNudge.title}`);
                      setEditModalNudge(null);
                    }}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Modal */}
        <AnimatePresence>
          {analyticsModalNudge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setAnalyticsModalNudge(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Analytics: {analyticsModalNudge.title}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setAnalyticsModalNudge(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <Send className="w-5 h-5 text-blue-600" />
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{analyticsModalNudge.sentCount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Sent</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-600">{analyticsModalNudge.openRate}%</p>
                      <p className="text-sm text-gray-600">Open Rate</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-600">{analyticsModalNudge.clickRate}%</p>
                      <p className="text-sm text-gray-600">Click Rate</p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg mb-3">Nudge Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Type</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(analyticsModalNudge.type)}`}>
                          {analyticsModalNudge.type.replace("-", " ")}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getStatusBadge(analyticsModalNudge.status)}`}>
                          {analyticsModalNudge.status}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Schedule</p>
                        <p className="font-medium text-gray-900">{analyticsModalNudge.schedule}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Created</p>
                        <p className="font-medium text-gray-900">{analyticsModalNudge.createdDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  {analyticsModalNudge.lastSent && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Last sent:</span> {analyticsModalNudge.lastSent}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setAnalyticsModalNudge(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteModalNudge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteModalNudge(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-red-600">Delete Nudge</h2>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteModalNudge(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Are you sure you want to delete this nudge?</p>
                        <p className="text-sm text-gray-600">
                          This action cannot be undone. The nudge "{deleteModalNudge.title}" will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {deleteModalNudge.status !== "draft" && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Current Performance:</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="font-bold text-gray-900">{deleteModalNudge.sentCount.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Sent</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{deleteModalNudge.openRate}%</p>
                          <p className="text-xs text-gray-600">Opens</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{deleteModalNudge.clickRate}%</p>
                          <p className="text-xs text-gray-600">Clicks</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setDeleteModalNudge(null)}>
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        alert(`Deleted: ${deleteModalNudge.title}`);
                        setDeleteModalNudge(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Import Modal */}
        <AnimatePresence>
          {showImportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowImportModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Import Nudges</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Upload Nudges File</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag and drop your CSV or JSON file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv,.json"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>CSV or JSON format</li>
                      <li>Required fields: title, message, type, trigger</li>
                      <li>Optional fields: targetAudience, schedule, status</li>
                      <li>Maximum file size: 5MB</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowImportModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      alert('Nudges imported successfully!');
                      setShowImportModal(false);
                    }}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Nudges
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Template Modal */}
        <AnimatePresence>
          {showCreateTemplateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateTemplateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create Nudge Template</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateTemplateModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <Input placeholder="e.g., Morning Check-in Template" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full p-3 border rounded-lg"
                      rows={2}
                      placeholder="Brief description of this template..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message Template</label>
                    <textarea
                      className="w-full p-3 border rounded-lg font-mono text-sm"
                      rows={4}
                      placeholder="Use variables like {{user_name}}, {{date}}, {{time}}..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Motivational</option>
                        <option>Reminder</option>
                        <option>Milestone</option>
                        <option>Wellness Tip</option>
                        <option>Check-in</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Default Schedule</label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Triggered</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Variables</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {['{{user_name}}', '{{date}}', '{{time}}', '{{day}}', '{{streak}}', '{{points}}'].map(variable => (
                          <span key={variable} className="px-2 py-1 bg-white border rounded text-xs font-mono">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-purple-900 font-medium mb-1">Template Tips</p>
                        <p className="text-sm text-purple-800">
                          Use variables to personalize messages. Templates can be reused across multiple nudge campaigns.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCreateTemplateModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      alert('Template created successfully!');
                      setShowCreateTemplateModal(false);
                    }}>
                      <FileText className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}