import { useState } from "react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { BulkUserActionsModal } from "../../components/BulkUserActionsModal";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Mail,
  Ban,
  CheckCircle2,
  XCircle,
  Users,
  UserPlus,
  UserX,
  Shield,
  ChevronDown,
  SlidersHorizontal,
  X,
  RefreshCw,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "suspended" | "inactive";
  joinDate: string;
  sessions: number;
  lastActive: string;
  riskLevel: "low" | "medium" | "high";
  subscription: "free" | "premium" | "enterprise";
  organization?: string;
}

type FilterType = "all" | "active" | "suspended" | "inactive";
type RiskFilter = "all" | "low" | "medium" | "high";
type SubscriptionFilter = "all" | "free" | "premium" | "enterprise";
type SortField = "name" | "joinDate" | "lastActive" | "sessions";
type SortDirection = "asc" | "desc";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    status: "active" as const,
    subscription: "free" as const,
    organization: "",
  });
  const usersPerPage = 10;

  const users: User[] = [
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.m@example.com",
      status: "active",
      joinDate: "2024-01-15",
      sessions: 45,
      lastActive: "2 hours ago",
      riskLevel: "low",
      subscription: "premium",
      organization: "HealthCare Corp",
    },
    {
      id: 2,
      name: "John Davis",
      email: "john.d@example.com",
      status: "active",
      joinDate: "2024-02-03",
      sessions: 32,
      lastActive: "5 minutes ago",
      riskLevel: "medium",
      subscription: "free",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      status: "active",
      joinDate: "2024-01-28",
      sessions: 67,
      lastActive: "1 day ago",
      riskLevel: "low",
      subscription: "premium",
      organization: "Wellness Inc",
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael.c@example.com",
      status: "suspended",
      joinDate: "2024-03-10",
      sessions: 12,
      lastActive: "3 days ago",
      riskLevel: "high",
      subscription: "free",
    },
    {
      id: 5,
      name: "Jessica Taylor",
      email: "jessica.t@example.com",
      status: "active",
      joinDate: "2024-02-18",
      sessions: 89,
      lastActive: "30 minutes ago",
      riskLevel: "low",
      subscription: "enterprise",
      organization: "MindCare Solutions",
    },
    {
      id: 6,
      name: "David Wilson",
      email: "david.w@example.com",
      status: "inactive",
      joinDate: "2024-01-05",
      sessions: 5,
      lastActive: "2 weeks ago",
      riskLevel: "medium",
      subscription: "free",
    },
    {
      id: 7,
      name: "Amanda Brown",
      email: "amanda.b@example.com",
      status: "active",
      joinDate: "2024-03-01",
      sessions: 28,
      lastActive: "1 hour ago",
      riskLevel: "low",
      subscription: "premium",
    },
    {
      id: 8,
      name: "Robert Lee",
      email: "robert.l@example.com",
      status: "active",
      joinDate: "2024-02-20",
      sessions: 54,
      lastActive: "4 hours ago",
      riskLevel: "medium",
      subscription: "premium",
      organization: "HealthCare Corp",
    },
  ];

  // Filter users
  let filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRisk = riskFilter === "all" || user.riskLevel === riskFilter;
    const matchesSubscription = subscriptionFilter === "all" || user.subscription === subscriptionFilter;
    
    return matchesSearch && matchesStatus && matchesRisk && matchesSubscription;
  });

  // Sort users
  filteredUsers.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "joinDate" || sortField === "lastActive") {
      aVal = new Date(a.joinDate).getTime();
      bVal = new Date(b.joinDate).getTime();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    highRisk: users.filter((u) => u.riskLevel === "high").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSubscriptionColor = (sub: string) => {
    switch (sub) {
      case "free":
        return "bg-gray-100 text-gray-700";
      case "premium":
        return "bg-blue-100 text-blue-700";
      case "enterprise":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setRiskFilter("all");
    setSubscriptionFilter("all");
    setSearchQuery("");
  };

  const handleExport = () => {
    // Demo export functionality
    const csvData = filteredUsers.map(u => 
      `${u.name},${u.email},${u.status},${u.subscription},${u.sessions},${u.riskLevel},${u.lastActive}`
    ).join('\n');
    
    const csvContent = `Name,Email,Status,Subscription,Sessions,Risk Level,Last Active\n${csvData}`;
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ezri-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAddUser = () => {
    // Demo add user functionality - in production this would open a modal or navigate to a form
    setShowAddUserModal(true);
  };

  const handleBulkAction = (action: string) => {
    alert(`Performing ${action} on ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };

  const navigate = useNavigate();

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                Manage and monitor all Ezri users
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2" onClick={handleAddUser}>
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("active")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("suspended")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("inactive")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setRiskFilter("high")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.highRisk}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(statusFilter !== "all" || riskFilter !== "all" || subscriptionFilter !== "all") && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
                  >
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as FilterType)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Risk Level</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subscription</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={subscriptionFilter}
                        onChange={(e) => setSubscriptionFilter(e.target.value as SubscriptionFilter)}
                      >
                        <option value="all">All Subscriptions</option>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <Button variant="ghost" onClick={clearFilters} className="gap-2">
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filters Display */}
              {(statusFilter !== "all" || riskFilter !== "all" || subscriptionFilter !== "all") && (
                <div className="flex flex-wrap gap-2">
                  {statusFilter !== "all" && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      Status: {statusFilter}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setStatusFilter("all")}
                      />
                    </span>
                  )}
                  {riskFilter !== "all" && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                      Risk: {riskFilter}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setRiskFilter("all")}
                      />
                    </span>
                  )}
                  {subscriptionFilter !== "all" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      Subscription: {subscriptionFilter}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSubscriptionFilter("all")}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("activate")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("suspend")}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("email")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.length}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        User
                        {sortField === "name" && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subscription
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("sessions")}
                    >
                      <div className="flex items-center gap-2">
                        Sessions
                        {sortField === "sessions" && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Level
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("lastActive")}
                    >
                      <div className="flex items-center gap-2">
                        Last Active
                        {sortField === "lastActive" && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.organization && (
                              <p className="text-xs text-muted-foreground">{user.organization}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getSubscriptionColor(
                            user.subscription
                          )}`}
                        >
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">{user.sessions}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`font-medium capitalize ${getRiskColor(
                            user.riskLevel
                          )}`}
                        >
                          {user.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {user.lastActive}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => navigate('/admin/user-details-enhanced', { 
                              state: { user }
                            })}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Show a simple action menu
                              const action = confirm(`Select action for ${user.name}:\n\n✉️ Email User\n🚫 Suspend User\n🗑️ Delete User\n\n(This is a demo - click OK to simulate)`);
                              if (action) {
                                alert(`Action performed for ${user.name}`);
                              }
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Add New User</h2>
                      <p className="text-sm text-muted-foreground">Create a new user account for Ezri</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddUserModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter user's full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "active" | "suspended" | "inactive" })}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subscription</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        value={newUser.subscription}
                        onChange={(e) => setNewUser({ ...newUser, subscription: e.target.value as "free" | "premium" | "enterprise" })}
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Organization (Optional)</label>
                    <Input
                      placeholder="Enter organization name"
                      value={newUser.organization}
                      onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setNewUser({
                        name: "",
                        email: "",
                        status: "active",
                        subscription: "free",
                        organization: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!newUser.name || !newUser.email) {
                        alert("Please fill in all required fields (Name and Email)");
                        return;
                      }
                      alert(`✅ User "${newUser.name}" (${newUser.email}) has been added!\n\nDetails:\n• Status: ${newUser.status}\n• Subscription: ${newUser.subscription}${newUser.organization ? `\n• Organization: ${newUser.organization}` : ""}\n\nThis is a demo - in production, this would create the user in the database.`);
                      setShowAddUserModal(false);
                      setNewUser({
                        name: "",
                        email: "",
                        status: "active",
                        subscription: "free",
                        organization: "",
                      });
                    }}
                    className="gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutNew>
  );
}