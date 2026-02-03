import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Activity,
  MessageSquare,
  Heart,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";

export function UserDetails() {
  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin/user-management">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                S
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Sarah Mitchell</h1>
                <p className="text-muted-foreground">sarah.m@example.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Email User
              </Button>
              <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <Ban className="w-4 h-4" />
                Suspend Account
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
            <p className="text-2xl font-bold">45</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Join Date</p>
            <p className="text-2xl font-bold">Jan 15</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Last Active</p>
            <p className="text-2xl font-bold">2h ago</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
            <p className="text-2xl font-bold text-green-600">Low</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">Sarah Mitchell</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">sarah.m@example.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subscription</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Premium - Active
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Preferred Avatar</p>
                <p className="font-medium">Serena (Empathetic)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { type: "session", text: "Completed session with Serena", time: "2 hours ago" },
                { type: "journal", text: "Created new journal entry", time: "1 day ago" },
                { type: "mood", text: "Logged mood as 'Good'", time: "1 day ago" },
                { type: "session", text: "Completed session with Luna", time: "3 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {activity.type === "session" && <MessageSquare className="w-4 h-4 text-primary" />}
                    {activity.type === "journal" && <Heart className="w-4 h-4 text-primary" />}
                    {activity.type === "mood" && <Activity className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Session History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avatar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sentiment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: "Dec 28, 2024", avatar: "Serena", topic: "Anxiety", duration: "45 min", sentiment: "Positive" },
                  { date: "Dec 25, 2024", avatar: "Luna", topic: "Mindfulness", duration: "38 min", sentiment: "Neutral" },
                  { date: "Dec 22, 2024", avatar: "Marcus", topic: "Work Stress", duration: "52 min", sentiment: "Improved" },
                ].map((session, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{session.date}</td>
                    <td className="px-4 py-3 text-sm">{session.avatar}</td>
                    <td className="px-4 py-3 text-sm">{session.topic}</td>
                    <td className="px-4 py-3 text-sm font-medium">{session.duration}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {session.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayoutNew>
  );
}