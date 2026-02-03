import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { StatsCard } from "../../components/StatsCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";

export function AdminDashboard() {
  const recentAlerts = [
    {
      id: 1,
      type: "crisis",
      user: "Sarah M.",
      message: "High-risk crisis keywords detected",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "support",
      user: "John D.",
      message: "Support ticket #2847 requires attention",
      time: "12 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      type: "system",
      user: "System",
      message: "Daily backup completed successfully",
      time: "1 hour ago",
      status: "resolved",
    },
  ];

  const recentSessions = [
    {
      id: 1,
      user: "Emily R.",
      avatar: "Serena",
      duration: "45 min",
      topic: "Anxiety Management",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: "Michael T.",
      avatar: "Marcus",
      duration: "32 min",
      topic: "Sleep Issues",
      time: "25 minutes ago",
    },
    {
      id: 3,
      user: "Jessica L.",
      avatar: "Luna",
      duration: "58 min",
      topic: "Depression Support",
      time: "1 hour ago",
    },
  ];

  return (
    <AdminLayoutNew>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with Ezri today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="12,459"
            change="+12.5%"
            changeType="positive"
            icon={Users}
            color="primary"
            delay={0}
          />
          <StatsCard
            title="Active Sessions Today"
            value="1,284"
            change="+8.3%"
            changeType="positive"
            icon={MessageSquare}
            color="secondary"
            delay={0.1}
          />
          <StatsCard
            title="Crisis Alerts"
            value="7"
            change="-15.2%"
            changeType="positive"
            icon={AlertTriangle}
            color="warning"
            delay={0.2}
          />
          <StatsCard
            title="Avg Session Time"
            value="42 min"
            change="+5 min"
            changeType="positive"
            icon={Clock}
            color="accent"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Recent Alerts</h2>
                  <p className="text-sm text-muted-foreground">
                    Requires immediate attention
                  </p>
                </div>
                <Link to="/admin/crisis-dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.status === "pending"
                          ? "bg-red-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{alert.user}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                    {alert.status === "pending" && (
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    {alert.status === "resolved" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Recent Sessions</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest user activity
                  </p>
                </div>
                <Link to="/admin/session-analytics">
                  <Button variant="outline" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {session.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">{session.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.topic} • {session.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {session.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/user-management">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors text-center group"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">Manage Users</p>
                </motion.div>
              </Link>
              <Link to="/admin/crisis-dashboard">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors text-center group"
                >
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">Crisis Monitor</p>
                </motion.div>
              </Link>
              <Link to="/admin/reports-analytics">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors text-center group"
                >
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-secondary group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">View Reports</p>
                </motion.div>
              </Link>
              <Link to="/admin/notifications-center">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors text-center group"
                >
                  <Activity className="w-8 h-8 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">Send Alert</p>
                </motion.div>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}