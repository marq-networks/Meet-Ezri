import { useState } from "react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bell, Users, Calendar, MessageSquare, X, Clock, CheckCircle, Eye, TrendingUp, Target } from "lucide-react";

export function NotificationsCenter() {
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<any>(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const recentNotifications = [
    {
      id: 1,
      title: "Platform Maintenance Notice",
      audience: "All Users",
      sent: "2024-12-28 18:00",
      delivered: 12459,
    },
    {
      id: 2,
      title: "New Wellness Exercise Available",
      audience: "Active Users",
      sent: "2024-12-27 14:30",
      delivered: 10234,
    },
    {
      id: 3,
      title: "Mental Health Awareness Week",
      audience: "All Users",
      sent: "2024-12-26 10:00",
      delivered: 12459,
    },
  ];

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Notifications Center</h1>
          <p className="text-muted-foreground">
            Send announcements and alerts to users
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Send New Notification</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title..."
                    className="mt-2"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Enter your message here..."
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Target Audience</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "all", label: "All Users", count: "12,459" },
                      { id: "active", label: "Active Users", count: "10,234" },
                      { id: "premium", label: "Premium Users", count: "8,234" },
                      { id: "trial", label: "Trial Users", count: "1,225" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedAudience(option.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAudience === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium mb-1">{option.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.count} users
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="scheduleDate">Schedule (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Input id="scheduleDate" type="date" />
                    <Input id="scheduleTime" type="time" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="pushNotification"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="pushNotification" className="!mb-0 cursor-pointer">
                    Also send as push notification
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 gap-2" onClick={() => {
                    if (!notificationTitle || !notificationMessage) {
                      alert('Please fill in both title and message');
                      return;
                    }
                    alert(`Notification sent to ${selectedAudience} users!\n\nTitle: ${notificationTitle}\nMessage: ${notificationMessage}`);
                    setNotificationTitle('');
                    setNotificationMessage('');
                  }}>
                    <Send className="w-4 h-4" />
                    Send Now
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowScheduleModal(true)}>
                    Schedule
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Sent This Week</p>
                  <p className="text-2xl font-bold text-primary">8</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Delivered</p>
                  <p className="text-2xl font-bold text-blue-600">45,234</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Templates</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  size="sm"
                  onClick={() => {
                    setNotificationTitle('Platform Maintenance Notice');
                    setNotificationMessage('We will be performing scheduled maintenance on our platform. Please save your work and expect a brief interruption of service.');
                  }}
                >
                  Maintenance Notice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  size="sm"
                  onClick={() => {
                    setNotificationTitle('New Feature Update');
                    setNotificationMessage('Exciting news! We\'ve just released new features to enhance your experience. Check out what\'s new in your dashboard.');
                  }}
                >
                  Feature Update
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  size="sm"
                  onClick={() => {
                    setNotificationTitle('Daily Wellness Tip');
                    setNotificationMessage('Remember to take regular breaks and practice mindfulness. Your mental health is important to us!');
                  }}
                >
                  Wellness Tip
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  size="sm"
                  onClick={() => {
                    setNotificationTitle('Upcoming Event Reminder');
                    setNotificationMessage('Don\'t forget about our upcoming wellness event. Mark your calendars and join us for an amazing experience!');
                  }}
                >
                  Event Reminder
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Recent Notifications</h2>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold mb-1">{notification.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {notification.audience}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {notification.sent}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Delivered to {notification.delivered.toLocaleString()} users
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(notification)}>
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center"
          >
            <Card className="p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Schedule Notification</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scheduleDate">Date</Label>
                  <Input id="scheduleDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="scheduleTime">Time</Label>
                  <Input id="scheduleTime" type="time" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2" onClick={() => {
                  if (!notificationTitle || !notificationMessage) {
                    alert('Please fill in both title and message');
                    return;
                  }
                  alert(`Notification scheduled successfully!\n\nTitle: ${notificationTitle}\nMessage: ${notificationMessage}\nAudience: ${selectedAudience}`);
                  setShowScheduleModal(false);
                  setNotificationTitle('');
                  setNotificationMessage('');
                }}>
                  <Clock className="w-4 h-4" />
                  Schedule
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center"
          >
            <Card className="p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Notification Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold mb-1">{showDetailsModal.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {showDetailsModal.audience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {showDetailsModal.sent}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Delivered to {showDetailsModal.delivered.toLocaleString()} users
                </p>
                <div className="mt-4">
                  <Label className="font-bold">Message</Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    {showDetailsModal.title}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDetailsModal(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutNew>
  );
}