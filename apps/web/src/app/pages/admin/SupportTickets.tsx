import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Calendar,
  Tag,
  Flag,
} from "lucide-react";
import { useState } from "react";

interface Ticket {
  id: number;
  subject: string;
  user: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  created: string;
  lastUpdate: string;
  description?: string;
  messages?: { from: string; message: string; time: string }[];
}

export function SupportTickets() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [newStatus, setNewStatus] = useState<"open" | "in-progress" | "resolved" | "closed">("open");
  const [selectedAgent, setSelectedAgent] = useState("");
  const itemsPerPage = 5;

  const allTickets: Ticket[] = [
    {
      id: 2847,
      subject: "Unable to start AI session",
      user: "john.d@example.com",
      status: "open",
      priority: "high",
      category: "Technical",
      created: "2024-12-29 14:30",
      lastUpdate: "12 minutes ago",
      description: "I'm trying to start an AI therapy session but the app keeps crashing when I click 'Start Session'. I've tried restarting the app multiple times but the issue persists.",
      messages: [
        { from: "john.d@example.com", message: "I'm trying to start an AI therapy session but the app keeps crashing.", time: "2024-12-29 14:30" },
        { from: "Support Team", message: "Thank you for reporting this. We're looking into it now.", time: "2024-12-29 14:35" },
      ]
    },
    {
      id: 2846,
      subject: "Billing inquiry about subscription",
      user: "emily.r@example.com",
      status: "in-progress",
      priority: "medium",
      category: "Billing",
      created: "2024-12-29 13:15",
      lastUpdate: "1 hour ago",
      description: "I was charged twice for my premium subscription this month. Could you please check my account and issue a refund for the duplicate charge?",
      messages: [
        { from: "emily.r@example.com", message: "I was charged twice for my premium subscription.", time: "2024-12-29 13:15" },
        { from: "Support Team", message: "We're reviewing your billing history and will resolve this shortly.", time: "2024-12-29 13:45" },
      ]
    },
    {
      id: 2845,
      subject: "Request to export my data",
      user: "michael.t@example.com",
      status: "resolved",
      priority: "medium",
      category: "Account",
      created: "2024-12-29 11:45",
      lastUpdate: "2 hours ago",
      description: "I would like to export all my data including session history, mood logs, and journal entries. How can I do this?",
      messages: [
        { from: "michael.t@example.com", message: "I would like to export all my data.", time: "2024-12-29 11:45" },
        { from: "Support Team", message: "You can export your data from Settings > Privacy > Export Data.", time: "2024-12-29 12:00" },
        { from: "michael.t@example.com", message: "Found it, thank you!", time: "2024-12-29 12:15" },
      ]
    },
    {
      id: 2844,
      subject: "Feature request: Dark mode",
      user: "sarah.m@example.com",
      status: "open",
      priority: "low",
      category: "Feature Request",
      created: "2024-12-29 10:20",
      lastUpdate: "3 hours ago",
      description: "Would love to see a dark mode option for the app. It would be easier on the eyes during evening sessions.",
      messages: [
        { from: "sarah.m@example.com", message: "Would love to see a dark mode option for the app.", time: "2024-12-29 10:20" },
      ]
    },
    {
      id: 2843,
      subject: "Cannot reset password",
      user: "jessica.l@example.com",
      status: "in-progress",
      priority: "urgent",
      category: "Technical",
      created: "2024-12-29 09:00",
      lastUpdate: "30 minutes ago",
      description: "I've tried to reset my password multiple times but I'm not receiving the reset email. I've checked spam folder as well.",
      messages: [
        { from: "jessica.l@example.com", message: "I'm not receiving the password reset email.", time: "2024-12-29 09:00" },
        { from: "Support Team", message: "We're investigating the email delivery issue.", time: "2024-12-29 09:15" },
      ]
    },
    {
      id: 2842,
      subject: "Session recording not working",
      user: "david.k@example.com",
      status: "open",
      priority: "medium",
      category: "Technical",
      created: "2024-12-29 08:30",
      lastUpdate: "4 hours ago",
      description: "The session recording feature is not saving my sessions. I have premium subscription and the feature should be enabled.",
    },
    {
      id: 2841,
      subject: "Upgrade to premium",
      user: "lisa.w@example.com",
      status: "resolved",
      priority: "low",
      category: "Billing",
      created: "2024-12-29 07:15",
      lastUpdate: "5 hours ago",
      description: "How do I upgrade my free account to premium? What are the payment options?",
    },
    {
      id: 2840,
      subject: "Avatar not loading",
      user: "robert.m@example.com",
      status: "in-progress",
      priority: "high",
      category: "Technical",
      created: "2024-12-28 22:45",
      lastUpdate: "Yesterday",
      description: "The AI avatar is not loading during my therapy sessions. Just seeing a blank screen.",
    },
  ];

  const totalPages = Math.ceil(allTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const tickets = allTickets.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 font-bold";
      case "high":
        return "text-orange-600 font-semibold";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setViewingTicket(ticket);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert("⚠️ Please enter a reply message!");
      return;
    }
    
    alert(`✅ Reply sent successfully!\n\nTo: ${viewingTicket?.user}\nMessage: ${replyMessage}\n\nThe user will be notified via email.`);
    
    setReplyMessage("");
    setShowReplyModal(false);
  };

  const handleUpdateStatus = () => {
    alert(`✅ Status updated successfully!\n\nTicket #${viewingTicket?.id}\nOld Status: ${viewingTicket?.status}\nNew Status: ${newStatus}\n\nThe ticket status has been changed.`);
    
    setShowStatusModal(false);
  };

  const handleAssignAgent = () => {
    if (!selectedAgent.trim()) {
      alert("⚠️ Please enter an agent's name!");
      return;
    }
    
    alert(`✅ Ticket assigned successfully!\n\nTicket #${viewingTicket?.id}\nAssigned to: ${selectedAgent}\n\nThe agent will be notified.`);
    
    setSelectedAgent("");
    setShowAssignModal(false);
  };

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage user support requests and inquiries
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
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
                  <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm text-muted-foreground mb-1">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">18</p>
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
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
                  <p className="text-2xl font-bold">2.4h</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
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
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-10" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tickets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Update
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-medium">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm max-w-xs truncate">
                          {ticket.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ticket.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ticket.lastUpdate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, allTickets.length)} of {allTickets.length} tickets
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* View Ticket Modal */}
        <AnimatePresence>
          {viewingTicket && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setViewingTicket(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setViewingTicket(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Ticket #{viewingTicket.id}</h2>
                      <p className="text-sm text-gray-600 mt-1">{viewingTicket.subject}</p>
                    </div>
                    <button
                      onClick={() => setViewingTicket(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">User</p>
                          <p className="font-medium text-gray-900">{viewingTicket.user}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="font-medium text-gray-900">{viewingTicket.created}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Tag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Category</p>
                          <p className="font-medium text-gray-900">{viewingTicket.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Flag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Priority</p>
                          <p className={`font-medium ${getPriorityColor(viewingTicket.priority)}`}>
                            {viewingTicket.priority.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Status</p>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                          viewingTicket.status
                        )}`}
                      >
                        {viewingTicket.status.replace("-", " ")}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {viewingTicket.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Messages/Conversation */}
                    {viewingTicket.messages && viewingTicket.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation</h3>
                        <div className="space-y-3">
                          {viewingTicket.messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg ${
                                msg.from === "Support Team"
                                  ? "bg-blue-50 border border-blue-100"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-gray-900">{msg.from}</p>
                                <p className="text-xs text-gray-500">{msg.time}</p>
                              </div>
                              <p className="text-gray-700 text-sm">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setShowReplyModal(true)}>
                        Reply to Ticket
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowStatusModal(true)}>
                        Change Status
                      </Button>
                      <Button variant="outline" onClick={() => setShowAssignModal(true)}>
                        Assign to Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Reply Modal */}
        <AnimatePresence>
          {showReplyModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowReplyModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setShowReplyModal(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Reply to Ticket #{viewingTicket?.id}</h2>
                      <p className="text-sm text-gray-600 mt-1">{viewingTicket?.subject}</p>
                    </div>
                    <button
                      onClick={() => setShowReplyModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">User</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.user}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.created}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Tag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Category</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Flag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Priority</p>
                          <p className={`font-medium ${getPriorityColor(viewingTicket?.priority || "low")}`}>
                            {viewingTicket?.priority?.toUpperCase() || "LOW"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Status</p>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                          viewingTicket?.status || "open"
                        )}`}
                      >
                        {viewingTicket?.status?.replace("-", " ") || "Open"}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {viewingTicket?.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Messages/Conversation */}
                    {viewingTicket?.messages && viewingTicket.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation</h3>
                        <div className="space-y-3">
                          {viewingTicket.messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg ${
                                msg.from === "Support Team"
                                  ? "bg-blue-50 border border-blue-100"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-gray-900">{msg.from}</p>
                                <p className="text-xs text-gray-500">{msg.time}</p>
                              </div>
                              <p className="text-gray-700 text-sm">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Reply</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <Input
                          placeholder="Type your reply here..."
                          className="w-full"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSendReply}>
                        Send Reply
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowReplyModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Status Modal */}
        <AnimatePresence>
          {showStatusModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowStatusModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setShowStatusModal(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Change Status of Ticket #{viewingTicket?.id}</h2>
                      <p className="text-sm text-gray-600 mt-1">{viewingTicket?.subject}</p>
                    </div>
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">User</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.user}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.created}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Tag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Category</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Flag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Priority</p>
                          <p className={`font-medium ${getPriorityColor(viewingTicket?.priority || "low")}`}>
                            {viewingTicket?.priority?.toUpperCase() || "LOW"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Status</p>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                          viewingTicket?.status || "open"
                        )}`}
                      >
                        {viewingTicket?.status?.replace("-", " ") || "Open"}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {viewingTicket?.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Messages/Conversation */}
                    {viewingTicket?.messages && viewingTicket.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation</h3>
                        <div className="space-y-3">
                          {viewingTicket.messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg ${
                                msg.from === "Support Team"
                                  ? "bg-blue-50 border border-blue-100"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-gray-900">{msg.from}</p>
                                <p className="text-xs text-gray-500">{msg.time}</p>
                              </div>
                              <p className="text-gray-700 text-sm">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Form */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Change Status</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <select
                          className="w-full"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as "open" | "in-progress" | "resolved" | "closed")}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleUpdateStatus}>
                        Update Status
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowStatusModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Assign Modal */}
        <AnimatePresence>
          {showAssignModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowAssignModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setShowAssignModal(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Assign Ticket #{viewingTicket?.id}</h2>
                      <p className="text-sm text-gray-600 mt-1">{viewingTicket?.subject}</p>
                    </div>
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">User</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.user}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.created}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Tag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Category</p>
                          <p className="font-medium text-gray-900">{viewingTicket?.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Flag className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Priority</p>
                          <p className={`font-medium ${getPriorityColor(viewingTicket?.priority || "low")}`}>
                            {viewingTicket?.priority?.toUpperCase() || "LOW"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Status</p>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                          viewingTicket?.status || "open"
                        )}`}
                      >
                        {viewingTicket?.status?.replace("-", " ") || "Open"}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {viewingTicket?.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Messages/Conversation */}
                    {viewingTicket?.messages && viewingTicket.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation</h3>
                        <div className="space-y-3">
                          {viewingTicket.messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg ${
                                msg.from === "Support Team"
                                  ? "bg-blue-50 border border-blue-100"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-gray-900">{msg.from}</p>
                                <p className="text-xs text-gray-500">{msg.time}</p>
                              </div>
                              <p className="text-gray-700 text-sm">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assign Form */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Assign to Agent</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <Input
                          placeholder="Enter agent's name..."
                          className="w-full"
                          value={selectedAgent}
                          onChange={(e) => setSelectedAgent(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAssignAgent}>
                        Assign
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowAssignModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}