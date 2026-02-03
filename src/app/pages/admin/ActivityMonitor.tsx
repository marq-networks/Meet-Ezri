import { useState } from "react";
import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  Activity,
  Video,
  Heart,
  BookOpen,
  User,
  Smartphone,
  Monitor,
  Filter,
  MapPin,
  Clock,
  Search,
} from "lucide-react";

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  type: "session" | "mood" | "journal" | "login" | "signup" | "settings";
  timestamp: Date;
  device: "mobile" | "desktop" | "tablet";
  location: string;
  duration?: number;
  status: "active" | "completed" | "idle";
}

export function ActivityMonitor() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLive, setIsLive] = useState(true);

  // Mock real-time activity data
  const activities: ActivityLog[] = [
    {
      id: "1",
      userId: "u001",
      userName: "Sarah Johnson",
      userAvatar: "SJ",
      action: "Started AI therapy session",
      type: "session",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      device: "mobile",
      location: "New York, NY",
      duration: 2,
      status: "active"
    },
    {
      id: "2",
      userId: "u002",
      userName: "Michael Chen",
      userAvatar: "MC",
      action: "Logged daily mood",
      type: "mood",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      device: "desktop",
      location: "San Francisco, CA",
      status: "completed"
    },
    {
      id: "3",
      userId: "u003",
      userName: "Emily Rodriguez",
      userAvatar: "ER",
      action: "Created journal entry",
      type: "journal",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      device: "tablet",
      location: "Austin, TX",
      status: "completed"
    },
    {
      id: "4",
      userId: "u004",
      userName: "David Kim",
      userAvatar: "DK",
      action: "Logged in",
      type: "login",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      device: "mobile",
      location: "Seattle, WA",
      status: "idle"
    },
    {
      id: "5",
      userId: "u005",
      userName: "Jessica Martinez",
      userAvatar: "JM",
      action: "New user signup",
      type: "signup",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      device: "desktop",
      location: "Miami, FL",
      status: "completed"
    },
    {
      id: "6",
      userId: "u006",
      userName: "Alex Thompson",
      userAvatar: "AT",
      action: "Started AI therapy session",
      type: "session",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      device: "mobile",
      location: "Boston, MA",
      duration: 18,
      status: "active"
    },
    {
      id: "7",
      userId: "u007",
      userName: "Rachel Green",
      userAvatar: "RG",
      action: "Updated settings",
      type: "settings",
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      device: "desktop",
      location: "Chicago, IL",
      status: "completed"
    },
    {
      id: "8",
      userId: "u008",
      userName: "James Wilson",
      userAvatar: "JW",
      action: "Logged daily mood",
      type: "mood",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      device: "mobile",
      location: "Denver, CO",
      status: "completed"
    },
    {
      id: "9",
      userId: "u009",
      userName: "Lisa Anderson",
      userAvatar: "LA",
      action: "Created journal entry",
      type: "journal",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      device: "tablet",
      location: "Portland, OR",
      status: "completed"
    },
    {
      id: "10",
      userId: "u010",
      userName: "Kevin Brown",
      userAvatar: "KB",
      action: "Started AI therapy session",
      type: "session",
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      device: "desktop",
      location: "Los Angeles, CA",
      duration: 35,
      status: "active"
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === "all" || activity.type === filter;
    const matchesSearch = activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActivityIcon = (type: string) => {
    switch(type) {
      case "session": return Video;
      case "mood": return Heart;
      case "journal": return BookOpen;
      case "login": case "signup": return User;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch(type) {
      case "session": return "from-blue-500 to-indigo-600";
      case "mood": return "from-pink-500 to-rose-600";
      case "journal": return "from-purple-500 to-violet-600";
      case "login": case "signup": return "from-green-500 to-emerald-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "idle": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getDeviceIcon = (device: string) => {
    switch(device) {
      case "mobile": return Smartphone;
      case "tablet": return Smartphone;
      case "desktop": return Monitor;
      default: return Monitor;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const activeUsers = activities.filter(a => a.status === "active").length;
  const activeSessions = activities.filter(a => a.type === "session" && a.status === "active").length;

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Activity Monitor</h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className="text-sm text-gray-600">{isLive ? "Live" : "Paused"}</span>
            </div>
            <p className="text-gray-600 mt-1">Real-time user activity tracking</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              isLive 
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isLive ? "Pause" : "Resume"} Live Feed
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSessions}</p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Activities</option>
                <option value="session">Sessions</option>
                <option value="mood">Mood Logs</option>
                <option value="journal">Journal</option>
                <option value="login">Login</option>
                <option value="signup">Signups</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Live Activity Feed</h2>
          
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const DeviceIcon = getDeviceIcon(activity.device);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {activity.userAvatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(activity.status)}`} />
                  </div>

                  {/* Activity Icon */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">{activity.userName}</p>
                    <p className="text-gray-600 text-sm truncate">{activity.action}</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DeviceIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{activity.device}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="hidden md:inline">{activity.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                    </div>

                    {activity.duration && (
                      <div className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">
                        {activity.duration}min
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No activities match your filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}