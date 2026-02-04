import { useState } from "react";
import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Filter,
  Search,
  ChevronDown,
  ArrowRight,
  Shield,
  Bell,
  Eye,
  X,
  PhoneCall,
  FileText,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../../components/ui/input";

interface FollowUp {
  id: number;
  userId: string;
  userName: string;
  originalIncident: string;
  incidentDate: string;
  followUpType: "24-hour" | "72-hour" | "weekly" | "scheduled";
  dueDate: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "completed" | "overdue";
  assignedTo: string;
  lastContact?: string;
  notes: string;
  riskLevel: "critical" | "high" | "medium" | "low";
}

type StatusFilter = "all" | "pending" | "completed" | "overdue";
type PriorityFilter = "all" | "urgent" | "high" | "normal";

export function CrisisFollowUpQueue() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const followUps: FollowUp[] = [
    {
      id: 1,
      userId: "user_2847",
      userName: "Sarah M.",
      originalIncident: "Self-harm indication",
      incidentDate: "Dec 29, 2024",
      followUpType: "24-hour",
      dueDate: "Dec 30, 2024 14:30",
      priority: "urgent",
      status: "pending",
      assignedTo: "Dr. Emily Chen",
      notes: "Critical case - immediate suicidal ideation. Requires close monitoring.",
      riskLevel: "critical",
    },
    {
      id: 2,
      userId: "user_1923",
      userName: "John D.",
      originalIncident: "Severe depression",
      incidentDate: "Dec 28, 2024",
      followUpType: "72-hour",
      dueDate: "Dec 31, 2024 10:00",
      priority: "high",
      status: "pending",
      assignedTo: "Dr. Sarah Williams",
      lastContact: "Yesterday 15:30",
      notes: "Responded well to initial contact. Scheduled therapy session.",
      riskLevel: "medium",
    },
    {
      id: 3,
      userId: "user_3456",
      userName: "Michael T.",
      originalIncident: "Suicidal ideation",
      incidentDate: "Dec 27, 2024",
      followUpType: "24-hour",
      dueDate: "Dec 28, 2024 18:00",
      priority: "urgent",
      status: "overdue",
      assignedTo: "Crisis Team Alpha",
      lastContact: "Dec 28, 16:45",
      notes: "Multiple attempts to contact. Left voicemail and sent email.",
      riskLevel: "high",
    },
    {
      id: 4,
      userId: "user_5621",
      userName: "Emily R.",
      originalIncident: "Anxiety spike",
      incidentDate: "Dec 26, 2024",
      followUpType: "weekly",
      dueDate: "Jan 2, 2025 09:00",
      priority: "normal",
      status: "pending",
      assignedTo: "Support Team",
      lastContact: "Dec 28, 11:20",
      notes: "Using coping techniques. Scheduled weekly check-in.",
      riskLevel: "low",
    },
    {
      id: 5,
      userId: "user_7834",
      userName: "David W.",
      originalIncident: "Crisis escalation",
      incidentDate: "Dec 29, 2024",
      followUpType: "72-hour",
      dueDate: "Jan 1, 2025 12:00",
      priority: "high",
      status: "pending",
      assignedTo: "Dr. Emily Chen",
      lastContact: "Today 09:15",
      notes: "Connected with family support. Monitoring closely.",
      riskLevel: "medium",
    },
    {
      id: 6,
      userId: "user_4512",
      userName: "Jessica L.",
      originalIncident: "Self-harm indication",
      incidentDate: "Dec 25, 2024",
      followUpType: "weekly",
      dueDate: "Dec 29, 2024 14:00",
      priority: "normal",
      status: "completed",
      assignedTo: "Dr. Sarah Williams",
      lastContact: "Dec 29, 13:45",
      notes: "Follow-up completed. User doing well, continuing regular sessions.",
      riskLevel: "low",
    },
  ];

  // Filter follow-ups
  const filteredFollowUps = followUps
    .filter((followUp) => {
      const matchesSearch =
        followUp.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        followUp.userId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || followUp.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || followUp.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { urgent: 0, high: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  // Stats
  const stats = {
    total: followUps.length,
    pending: followUps.filter((f) => f.status === "pending").length,
    overdue: followUps.filter((f) => f.status === "overdue").length,
    completed: followUps.filter((f) => f.status === "completed").length,
    urgent: followUps.filter((f) => f.priority === "urgent").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFollowUpTypeColor = (type: string) => {
    switch (type) {
      case "24-hour":
        return "bg-red-50 text-red-700 border-red-200";
      case "72-hour":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "weekly":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crisis Follow-up Queue</h1>
                <p className="text-muted-foreground">
                  Scheduled follow-ups and check-ins for at-risk users
                </p>
              </div>
            </div>
            <Link to="/admin/crisis-dashboard">
              <Button variant="outline" className="gap-2">
                <Shield className="w-4 h-4" />
                Crisis Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-red-50 border-red-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-bold text-red-900">
                    {stats.overdue} Overdue Follow-up{stats.overdue !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-red-700">
                    Immediate attention required for overdue check-ins
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Queue</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("pending")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("overdue")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("completed")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setPriorityFilter("urgent")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
                </div>
                <Bell className="w-8 h-8 text-red-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name or ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Follow-up Queue */}
        <div className="space-y-4">
          {filteredFollowUps.map((followUp, index) => (
            <motion.div
              key={followUp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <Card className={`p-6 hover:shadow-lg transition-shadow ${
                followUp.status === "overdue" ? "border-l-4 border-red-500" :
                followUp.priority === "urgent" ? "border-l-4 border-orange-500" : ""
              }`}>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {followUp.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-lg">{followUp.userName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(followUp.priority)}`}>
                            {followUp.priority.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(followUp.status)}`}>
                            {followUp.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFollowUpTypeColor(followUp.followUpType)}`}>
                            {followUp.followUpType} Check-in
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          User ID: {followUp.userId} • Original Incident: {followUp.originalIncident}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Incident Date:</span>
                            <span className="font-medium">{followUp.incidentDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due:</span>
                            <span className={`font-medium ${
                              followUp.status === "overdue" ? "text-red-600" : ""
                            }`}>
                              {followUp.dueDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Assigned:</span>
                            <span className="font-medium">{followUp.assignedTo}</span>
                          </div>
                          {followUp.lastContact && (
                            <div className="flex items-center gap-2 text-sm">
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Last Contact:</span>
                              <span className="font-medium">{followUp.lastContact}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                          <Shield className={`w-4 h-4 mt-0.5 ${getRiskColor(followUp.riskLevel)}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              Notes
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(followUp.riskLevel)}`}>
                                {followUp.riskLevel} risk
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:items-end">
                    <Button variant="outline" className="flex-1 lg:flex-initial gap-2" onClick={() => { setSelectedFollowUp(followUp); setShowDetailsModal(true); }}>
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    {followUp.status !== "completed" && (
                      <>
                        <Button variant="outline" className="flex-1 lg:flex-initial gap-2" onClick={() => { setSelectedFollowUp(followUp); setShowCallModal(true); }}>
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                        <Button className="flex-1 lg:flex-initial gap-2 bg-green-600 hover:bg-green-700" onClick={() => { setSelectedFollowUp(followUp); setShowCompleteModal(true); }}>
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFollowUps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">No Follow-ups Found</h3>
            <p className="text-muted-foreground">
              No follow-ups match the current filters
            </p>
          </motion.div>
        )}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedFollowUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Follow-up Details</h3>
                  <p className="text-gray-600">{selectedFollowUp.userName} - {selectedFollowUp.userId}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedFollowUp.priority)}`}>
                    {selectedFollowUp.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedFollowUp.status)}`}>
                    {selectedFollowUp.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFollowUpTypeColor(selectedFollowUp.followUpType)}`}>
                    {selectedFollowUp.followUpType} Check-in
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Original Incident</p>
                    <p className="font-semibold">{selectedFollowUp.originalIncident}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Incident Date</p>
                    <p className="font-semibold">{selectedFollowUp.incidentDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Due Date</p>
                    <p className="font-semibold">{selectedFollowUp.dueDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                    <p className="font-semibold">{selectedFollowUp.assignedTo}</p>
                  </div>
                  {selectedFollowUp.lastContact && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Last Contact</p>
                      <p className="font-semibold">{selectedFollowUp.lastContact}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <p className={`font-semibold ${getRiskColor(selectedFollowUp.riskLevel)}`}>
                      {selectedFollowUp.riskLevel.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <p className="font-semibold">Case Notes</p>
                  </div>
                  <p className="text-gray-700">{selectedFollowUp.notes}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {selectedFollowUp.status !== "completed" && (
                  <>
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowCallModal(true);
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      Call User
                    </Button>
                    <Button
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowCompleteModal(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Modal */}
      <AnimatePresence>
        {showCallModal && selectedFollowUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCallModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Call User</h3>
                  <p className="text-gray-600">Follow-up call for {selectedFollowUp.userName}</p>
                </div>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-blue-900 mb-3">Follow-up Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-700" />
                    <span className="font-semibold">{selectedFollowUp.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span>Original Incident: {selectedFollowUp.originalIncident}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>Due: {selectedFollowUp.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${getRiskColor(selectedFollowUp.riskLevel)}`} />
                    <span className={getRiskColor(selectedFollowUp.riskLevel)}>Risk Level: {selectedFollowUp.riskLevel}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Call Notes</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={6}
                  placeholder="Document the call: user's current state, concerns discussed, next steps, any urgent issues..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                  onClick={() => {
                    console.log('Call initiated:', callNotes);
                    setShowCallModal(false);
                    setCallNotes("");
                  }}
                >
                  <PhoneCall className="w-4 h-4" />
                  Start Call
                </Button>
                <Button
                  variant="outline"
                  className="px-6"
                  onClick={() => {
                    setShowCallModal(false);
                    setCallNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Follow-up Modal */}
      <AnimatePresence>
        {showCompleteModal && selectedFollowUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Follow-up</h3>
                  <p className="text-gray-600">Mark follow-up as completed for {selectedFollowUp.userName}</p>
                </div>
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-green-900 mb-3">Follow-up Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-700" />
                    <span className="font-semibold">{selectedFollowUp.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <span>Follow-up Type: {selectedFollowUp.followUpType} Check-in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-700" />
                    <span>Original Incident: {selectedFollowUp.originalIncident}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Completion Notes</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={6}
                  placeholder="Document the outcome: user's current wellbeing, progress since incident, any concerns, recommended next steps..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  onClick={() => {
                    console.log('Follow-up completed:', completionNotes);
                    setShowCompleteModal(false);
                    setCompletionNotes("");
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </Button>
                <Button
                  variant="outline"
                  className="px-6"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompletionNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutNew>
  );
}