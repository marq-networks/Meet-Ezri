import { motion } from "motion/react";
import { AppLayout } from "@/app/components/AppLayout";
import { 
  Bell, 
  Heart, 
  Video, 
  Award, 
  MessageSquare,
  Calendar,
  TrendingUp,
  CheckCircle2,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface Notification {
  id: string;
  type: "mood" | "session" | "achievement" | "reminder" | "system" | "message";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reminder",
      title: "Daily Check-In Reminder",
      message: "Don't forget to log your mood today! It's been 8 hours since your last check-in.",
      time: "2 hours ago",
      read: false,
      icon: Heart,
      color: "from-pink-500 to-rose-600"
    },
    {
      id: "2",
      type: "achievement",
      title: "New Achievement Unlocked! 🎉",
      message: "Congratulations! You've earned the '7-Day Streak' badge for checking in daily for a week.",
      time: "5 hours ago",
      read: false,
      icon: Award,
      color: "from-yellow-500 to-orange-600"
    },
    {
      id: "3",
      type: "session",
      title: "Session Reminder",
      message: "Your scheduled AI therapy session is in 30 minutes. Tap to prepare.",
      time: "1 day ago",
      read: true,
      icon: Video,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "4",
      type: "mood",
      title: "Mood Trending Up 📈",
      message: "Great news! Your average mood has improved by 15% this week. Keep up the great work!",
      time: "2 days ago",
      read: true,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "5",
      type: "message",
      title: "New Message",
      message: "You received a supportive message from the Ezri community.",
      time: "3 days ago",
      read: true,
      icon: MessageSquare,
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "6",
      type: "reminder",
      title: "Weekly Goal Update",
      message: "You've completed 4 of 5 check-ins for this week. One more to hit your goal!",
      time: "4 days ago",
      read: true,
      icon: Calendar,
      color: "from-teal-500 to-cyan-600"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                    : "You're all caught up!"
                  }
                </p>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark all as read
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-sm"
            >
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">
                You're all caught up! Check back later for updates.
              </p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = notification.icon;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${
                    notification.read 
                      ? "border-gray-200 opacity-75" 
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${notification.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm sm:text-base ${
                            notification.read ? "text-gray-600" : "text-gray-900"
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-xs sm:text-sm ${
                            notification.read ? "text-gray-500" : "text-gray-700"
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-400">{notification.time}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.button>
                          )}
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
