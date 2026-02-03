import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar, Activity, MessageSquare, Heart, AlertTriangle, Ban, CheckCircle2, Clock, MapPin, Shield, Star, TrendingUp, TrendingDown, Edit, Trash2, Key, Send, Download, Eye, EyeOff, User, CreditCard, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function UserDetailsEnhanced() {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"overview" | "activity" | "sessions" | "security">("overview");

  const user = {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "S",
    status: "active",
    riskLevel: "low",
    subscription: "premium",
    organization: "HealthCare Corp",
    joinDate: "Jan 15, 2024",
    lastActive: "2 hours ago",
    location: "San Francisco, CA",
    timezone: "PST (UTC-8)",
    preferredAvatar: "Serena (Empathetic)",
    totalSessions: 45,
    avgSessionDuration: "42 min",
    completionRate: "94%",
    avgMoodScore: 7.2,
    journalEntries: 38,
    wellnessStreak: 12,
  };

  const stats = [
    { label: "Total Sessions", value: "45", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Mood Score", value: "7.2/10", icon: Heart, color: "text-pink-600", bg: "bg-pink-100" },
    { label: "Wellness Streak", value: "12 days", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { label: "Journal Entries", value: "38", icon: Edit, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const activityTimeline = [
    {
      id: 1,
      type: "session",
      title: "Completed therapy session",
      description: "45-minute session with Serena - Anxiety Management",
      time: "2 hours ago",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 2,
      type: "mood",
      title: "Logged mood check-in",
      description: "Mood: Good (7/10) - Feeling productive and focused",
      time: "5 hours ago",
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      id: 3,
      type: "journal",
      title: "Created journal entry",
      description: "Daily reflection: Work-life balance insights",
      time: "1 day ago",
      icon: Edit,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 4,
      type: "session",
      title: "Completed therapy session",
      description: "32-minute session with Luna - Sleep Issues",
      time: "3 days ago",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 5,
      type: "achievement",
      title: "Earned wellness badge",
      description: "7-Day Wellness Warrior - Maintained daily check-ins",
      time: "5 days ago",
      icon: Star,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const recentSessions = [
    {
      id: 1,
      date: "Dec 28, 2024",
      avatar: "Serena",
      topic: "Anxiety Management",
      duration: "45 min",
      sentiment: "Positive",
      rating: 5,
    },
    {
      id: 2,
      date: "Dec 25, 2024",
      avatar: "Luna",
      topic: "Sleep Issues",
      duration: "32 min",
      sentiment: "Neutral",
      rating: 4,
    },
    {
      id: 3,
      date: "Dec 22, 2024",
      avatar: "Marcus",
      topic: "Work Stress",
      duration: "58 min",
      sentiment: "Positive",
      rating: 5,
    },
    {
      id: 4,
      date: "Dec 19, 2024",
      avatar: "Serena",
      topic: "Relationship Issues",
      duration: "41 min",
      sentiment: "Positive",
      rating: 4,
    },
  ];

  const securityEvents = [
    {
      id: 1,
      event: "Password changed",
      time: "2 weeks ago",
      ip: "192.168.1.1",
      device: "iPhone 14 Pro",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      event: "Login from new device",
      time: "1 month ago",
      ip: "192.168.1.24",
      device: "MacBook Pro",
      location: "San Francisco, CA",
    },
    {
      id: 3,
      event: "Email verified",
      time: "3 months ago",
      ip: "192.168.1.1",
      device: "iPhone 14 Pro",
      location: "San Francisco, CA",
    },
  ];

  const handleAction = (action: string) => {
    alert(`Performing action: ${action}`);
    setShowActionMenu(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "sessions", label: "Sessions", icon: MessageSquare },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin/user-management">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              >
                {user.avatar}
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {user.status}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {user.subscription}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    user.riskLevel === "low" ? "bg-green-100 text-green-700" :
                    user.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {user.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                >
                  <Settings className="w-4 h-4" />
                  Actions
                </Button>
                <AnimatePresence>
                  {showActionMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border z-50"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => handleAction("reset-password")}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Key className="w-4 h-4" />
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleAction("send-message")}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                        <button
                          onClick={() => handleAction("export-data")}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export Data
                        </button>
                        <div className="border-t my-2" />
                        <button
                          onClick={() => handleAction("suspend")}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Suspend Account
                        </button>
                        <button
                          onClick={() => handleAction("delete")}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="border-b">
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* User Information */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  User Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Organization</p>
                    <p className="font-medium">{user.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {user.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timezone</p>
                    <p className="font-medium">{user.timezone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {user.joinDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Active</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {user.lastActive}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preferred Avatar</p>
                    <p className="font-medium">{user.preferredAvatar}</p>
                  </div>
                </div>
              </Card>

              {/* Performance Metrics */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance Metrics
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                      <p className="font-bold text-blue-600">{user.avgSessionDuration}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="font-bold text-green-600">{user.completionRate}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Avg Mood Score</p>
                      <p className="font-bold text-pink-600">{user.avgMoodScore}/10</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-600 h-2 rounded-full" style={{ width: "72%" }} />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Journal Entries</span>
                      <span className="font-bold text-purple-600">{user.journalEntries}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Wellness Streak</span>
                      <span className="font-bold text-green-600">{user.wellnessStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Risk Assessment</span>
                      <span className="font-bold text-green-600 capitalize">{user.riskLevel}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Activity Timeline
                </h2>
                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 relative"
                    >
                      {index !== activityTimeline.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0 relative z-10`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === "sessions" && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Sessions
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avatar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentSessions.map((session, index) => (
                        <motion.tr
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm">{session.date}</td>
                          <td className="px-4 py-3 text-sm font-medium">{session.avatar}</td>
                          <td className="px-4 py-3 text-sm">{session.topic}</td>
                          <td className="px-4 py-3 text-sm">{session.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              session.sentiment === "Positive" ? "bg-green-100 text-green-700" :
                              session.sentiment === "Neutral" ? "bg-gray-100 text-gray-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {session.sentiment}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {[...Array(session.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Events
                </h2>
                <div className="space-y-4">
                  {securityEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{event.event}</p>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">IP Address</p>
                          <p className="font-medium">{event.ip}</p>
                        </div>
                        <div>
                          <p className="text-xs">Device</p>
                          <p className="font-medium">{event.device}</p>
                        </div>
                        <div>
                          <p className="text-xs">Location</p>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-bold mb-4">Security Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start gap-2">
                      <Key className="w-4 h-4" />
                      Force Password Reset
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Ban className="w-4 h-4" />
                      Revoke All Sessions
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Bell className="w-4 h-4" />
                      Enable 2FA
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Download className="w-4 h-4" />
                      Download Security Log
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}