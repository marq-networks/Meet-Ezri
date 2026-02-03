import { motion, AnimatePresence } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Filter,
  Bell,
  MessageSquare,
  Heart,
  Calendar,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  X,
  Save,
  BarChart3,
  Send,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useNavigate } from "react-router-dom";

interface NudgeTemplate {
  id: string;
  name: string;
  category: string;
  type: "push" | "email" | "in-app" | "sms";
  title: string;
  message: string;
  variables: string[];
  icon: any;
  iconColor: string;
  usage: number;
  rating: number;
  status: "active" | "draft" | "archived";
  createdBy: string;
  lastUsed: string;
}

export function NudgeTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Modal states
  const [viewModalTemplate, setViewModalTemplate] = useState<NudgeTemplate | null>(null);
  const [editModalTemplate, setEditModalTemplate] = useState<NudgeTemplate | null>(null);
  const [deleteModalTemplate, setDeleteModalTemplate] = useState<NudgeTemplate | null>(null);
  const [analyticsModalTemplate, setAnalyticsModalTemplate] = useState<NudgeTemplate | null>(null);

  const templates: NudgeTemplate[] = [
    {
      id: "1",
      name: "Daily Mood Check-in Reminder",
      category: "Engagement",
      type: "push",
      title: "How are you feeling today?",
      message: "Hi {{name}}, take a moment to check in with yourself. Your mood matters! 💙",
      variables: ["name"],
      icon: Heart,
      iconColor: "#ec4899",
      usage: 1234,
      rating: 4.8,
      status: "active",
      createdBy: "Sarah Chen",
      lastUsed: "2 hours ago",
    },
    {
      id: "2",
      name: "Breathing Exercise Prompt",
      category: "Wellness",
      type: "in-app",
      title: "Time for a quick breather",
      message: "Hey {{name}}, let's take 5 minutes for a breathing exercise. Ready?",
      variables: ["name"],
      icon: Zap,
      iconColor: "#10b981",
      usage: 2156,
      rating: 4.9,
      status: "active",
      createdBy: "Dr. Michael Ross",
      lastUsed: "1 hour ago",
    },
    {
      id: "3",
      name: "Weekly Progress Summary",
      category: "Progress",
      type: "email",
      title: "Your wellness journey this week",
      message: "Hi {{name}}, you've completed {{sessions}} sessions this week! Keep up the great work.",
      variables: ["name", "sessions"],
      icon: TrendingUp,
      iconColor: "#3b82f6",
      usage: 892,
      rating: 4.7,
      status: "active",
      createdBy: "Emma Wilson",
      lastUsed: "3 days ago",
    },
    {
      id: "4",
      name: "Session Completion Celebration",
      category: "Achievement",
      type: "push",
      title: "🎉 Amazing work, {{name}}!",
      message: "You just completed your {{milestone}}th session! You're making incredible progress.",
      variables: ["name", "milestone"],
      icon: Star,
      iconColor: "#f59e0b",
      usage: 1567,
      rating: 4.9,
      status: "active",
      createdBy: "Sarah Chen",
      lastUsed: "30 minutes ago",
    },
    {
      id: "5",
      name: "Sleep Reminder",
      category: "Wellness",
      type: "push",
      title: "Wind down for better sleep",
      message: "Hi {{name}}, it's {{time}}. Time to start your evening routine for restful sleep.",
      variables: ["name", "time"],
      icon: Clock,
      iconColor: "#8b5cf6",
      usage: 1789,
      rating: 4.6,
      status: "active",
      createdBy: "Dr. Michael Ross",
      lastUsed: "5 hours ago",
    },
    {
      id: "6",
      name: "Re-engagement Nudge",
      category: "Retention",
      type: "email",
      title: "We miss you, {{name}}",
      message: "It's been {{days}} days since your last session. We're here whenever you're ready.",
      variables: ["name", "days"],
      icon: MessageSquare,
      iconColor: "#06b6d4",
      usage: 543,
      rating: 4.5,
      status: "active",
      createdBy: "Emma Wilson",
      lastUsed: "1 day ago",
    },
    {
      id: "7",
      name: "Upcoming Session Reminder",
      category: "Engagement",
      type: "push",
      title: "Your session starts soon",
      message: "Hi {{name}}, your session with {{therapist}} starts in {{minutes}} minutes.",
      variables: ["name", "therapist", "minutes"],
      icon: Calendar,
      iconColor: "#f97316",
      usage: 2341,
      rating: 4.8,
      status: "active",
      createdBy: "Sarah Chen",
      lastUsed: "1 hour ago",
    },
    {
      id: "8",
      name: "Streak Milestone",
      category: "Achievement",
      type: "in-app",
      title: "🔥 {{streak}} day streak!",
      message: "Incredible consistency, {{name}}! You've checked in for {{streak}} days in a row.",
      variables: ["name", "streak"],
      icon: Target,
      iconColor: "#ef4444",
      usage: 987,
      rating: 4.9,
      status: "draft",
      createdBy: "Dr. Michael Ross",
      lastUsed: "Never",
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesType = selectedType === "all" || template.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || template.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const stats = [
    {
      label: "Total Templates",
      value: templates.length.toString(),
      color: "from-purple-500 to-pink-600",
      icon: Bell,
    },
    {
      label: "Active Templates",
      value: templates.filter((t) => t.status === "active").length.toString(),
      color: "from-green-500 to-emerald-600",
      icon: CheckCircle2,
    },
    {
      label: "Total Usage",
      value: templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString(),
      color: "from-blue-500 to-cyan-600",
      icon: TrendingUp,
    },
    {
      label: "Avg Rating",
      value: (
        templates.reduce((sum, t) => sum + t.rating, 0) / templates.length
      ).toFixed(1),
      color: "from-orange-500 to-amber-600",
      icon: Star,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "push":
        return "📱";
      case "email":
        return "📧";
      case "in-app":
        return "💬";
      case "sms":
        return "💬";
      default:
        return "📢";
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Nudge Templates</h1>
            <p className="text-gray-600">
              Pre-built notification templates with personalization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="Engagement">Engagement</option>
                <option value="Wellness">Wellness</option>
                <option value="Progress">Progress</option>
                <option value="Achievement">Achievement</option>
                <option value="Retention">Retention</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="push">Push Notification</option>
                <option value="email">Email</option>
                <option value="in-app">In-App</option>
                <option value="sms">SMS</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${template.iconColor}20` }}
                  >
                    <template.icon
                      className="w-6 h-6"
                      style={{ color: template.iconColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getTypeIcon(template.type)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${
                            template.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : template.status === "draft"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {template.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{template.category}</p>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {template.title}
                  </p>
                  <p className="text-sm text-gray-700">{template.message}</p>
                </div>

                {/* Variables */}
                {template.variables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-xs font-mono"
                        >
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Usage</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {template.usage.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <p className="text-sm text-gray-900 font-medium">
                        {template.rating}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Used</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {template.lastUsed}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-600">
                    by {template.createdBy}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setViewModalTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        alert(`Copied template: ${template.name}`);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setAnalyticsModalTemplate(template)}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => setEditModalTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteModalTemplate(template)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white border border-gray-200 p-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or create a new template
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </Card>
          </motion.div>
        )}

        {/* View Modal */}
        <AnimatePresence>
          {viewModalTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setViewModalTemplate(null)}
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
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${viewModalTemplate.iconColor}20` }}
                    >
                      <viewModalTemplate.icon
                        className="w-6 h-6"
                        style={{ color: viewModalTemplate.iconColor }}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">View Template</h2>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium border ${
                          viewModalTemplate.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : viewModalTemplate.status === "draft"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {viewModalTemplate.status}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setViewModalTemplate(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Template Name</label>
                    <p className="text-lg font-semibold text-gray-900">{viewModalTemplate.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                      <p className="font-medium text-gray-900">{viewModalTemplate.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
                      <p className="font-medium text-gray-900">{getTypeIcon(viewModalTemplate.type)} {viewModalTemplate.type}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">{viewModalTemplate.title}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{viewModalTemplate.message}</p>
                    </div>
                  </div>

                  {viewModalTemplate.variables.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Variables</label>
                      <div className="flex flex-wrap gap-2">
                        {viewModalTemplate.variables.map((variable) => (
                          <span
                            key={variable}
                            className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-mono"
                          >
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-3">Performance</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-2xl font-bold text-blue-600">{viewModalTemplate.usage.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Usage</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-2xl font-bold text-yellow-600">{viewModalTemplate.rating}</p>
                        <p className="text-xs text-gray-600">Rating</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-bold text-gray-900">{viewModalTemplate.lastUsed}</p>
                        <p className="text-xs text-gray-600">Last Used</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Created by <span className="font-medium text-gray-900">{viewModalTemplate.createdBy}</span></p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setViewModalTemplate(null)}>
                      Close
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      setEditModalTemplate(viewModalTemplate);
                      setViewModalTemplate(null);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editModalTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditModalTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Edit Template</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditModalTemplate(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <Input defaultValue={editModalTemplate.name} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalTemplate.category}>
                        <option value="Engagement">Engagement</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Progress">Progress</option>
                        <option value="Achievement">Achievement</option>
                        <option value="Retention">Retention</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalTemplate.type}>
                        <option value="push">Push Notification</option>
                        <option value="email">Email</option>
                        <option value="in-app">In-App</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input defaultValue={editModalTemplate.title} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full p-3 border rounded-lg"
                      rows={4}
                      defaultValue={editModalTemplate.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Variables (comma separated)</label>
                    <Input defaultValue={editModalTemplate.variables.join(", ")} placeholder="name, sessions, etc." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select className="w-full px-3 py-2 border rounded-lg" defaultValue={editModalTemplate.status}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setEditModalTemplate(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      alert(`Saved changes to: ${editModalTemplate.name}`);
                      setEditModalTemplate(null);
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
          {analyticsModalTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setAnalyticsModalTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Template Analytics: {analyticsModalTemplate.name}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setAnalyticsModalTemplate(null)}>
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
                      <p className="text-3xl font-bold text-blue-600">{analyticsModalTemplate.usage.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Usage</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-3xl font-bold text-yellow-600">{analyticsModalTemplate.rating}</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-600">{analyticsModalTemplate.status}</p>
                      <p className="text-sm text-gray-600">Status</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg mb-3">Template Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Category</p>
                        <p className="font-medium text-gray-900">{analyticsModalTemplate.category}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Type</p>
                        <p className="font-medium text-gray-900">{getTypeIcon(analyticsModalTemplate.type)} {analyticsModalTemplate.type}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Created By</p>
                        <p className="font-medium text-gray-900">{analyticsModalTemplate.createdBy}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-1">Last Used</p>
                        <p className="font-medium text-gray-900">{analyticsModalTemplate.lastUsed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Variables */}
                  {analyticsModalTemplate.variables.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-bold text-lg mb-3">Variables Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {analyticsModalTemplate.variables.map((variable) => (
                          <span
                            key={variable}
                            className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-mono"
                          >
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setAnalyticsModalTemplate(null)}>
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
          {deleteModalTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteModalTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-red-600">Delete Template</h2>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteModalTemplate(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Are you sure you want to delete this template?</p>
                        <p className="text-sm text-gray-600">
                          This action cannot be undone. The template "{deleteModalTemplate.name}" will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Template Performance:</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="font-bold text-gray-900">{deleteModalTemplate.usage.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Total Usage</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{deleteModalTemplate.rating}</p>
                        <p className="text-xs text-gray-600">Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setDeleteModalTemplate(null)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        alert(`Deleted template: ${deleteModalTemplate.name}`);
                        setDeleteModalTemplate(null);
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
      </div>
    </AdminLayoutNew>
  );
}
