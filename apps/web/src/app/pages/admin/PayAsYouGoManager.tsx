import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Settings
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { SUBSCRIPTION_PLANS } from "../../utils/subscriptionPlans";
import type { PlanTier, PayAsYouGoPurchase } from "../../utils/subscriptionPlans";

// Mock PAYG transaction data
const MOCK_PAYG_TRANSACTIONS: PayAsYouGoPurchase[] = [
  {
    id: "payg-001",
    userId: "user-123",
    planId: "basic",
    minutesPurchased: 100,
    ratePerMinute: 0.25,
    totalCost: 25.00,
    purchaseDate: "2026-01-23T14:32:00Z",
    paymentMethod: "Visa •••• 4242",
    status: "completed"
  },
  {
    id: "payg-002",
    userId: "user-456",
    planId: "pro",
    minutesPurchased: 200,
    ratePerMinute: 0.15,
    totalCost: 30.00,
    purchaseDate: "2026-01-23T10:15:00Z",
    paymentMethod: "Mastercard •••• 5555",
    status: "completed"
  },
  {
    id: "payg-003",
    userId: "user-789",
    planId: "basic",
    minutesPurchased: 50,
    ratePerMinute: 0.25,
    totalCost: 12.50,
    purchaseDate: "2026-01-22T16:45:00Z",
    paymentMethod: "Visa •••• 1234",
    status: "completed"
  },
  {
    id: "payg-004",
    userId: "user-234",
    planId: "enterprise",
    minutesPurchased: 300,
    ratePerMinute: 0.10,
    totalCost: 30.00,
    purchaseDate: "2026-01-22T09:20:00Z",
    paymentMethod: "Amex •••• 9876",
    status: "completed"
  },
  {
    id: "payg-005",
    userId: "user-567",
    planId: "pro",
    minutesPurchased: 150,
    ratePerMinute: 0.15,
    totalCost: 22.50,
    purchaseDate: "2026-01-21T18:30:00Z",
    paymentMethod: "Visa •••• 8888",
    status: "completed"
  },
  {
    id: "payg-006",
    userId: "user-890",
    planId: "basic",
    minutesPurchased: 75,
    ratePerMinute: 0.25,
    totalCost: 18.75,
    purchaseDate: "2026-01-21T13:10:00Z",
    paymentMethod: "Mastercard •••• 3333",
    status: "completed"
  },
  {
    id: "payg-007",
    userId: "user-345",
    planId: "pro",
    minutesPurchased: 100,
    ratePerMinute: 0.15,
    totalCost: 15.00,
    purchaseDate: "2026-01-20T11:25:00Z",
    paymentMethod: "Visa •••• 6789",
    status: "completed"
  },
  {
    id: "payg-008",
    userId: "user-678",
    planId: "enterprise",
    minutesPurchased: 500,
    ratePerMinute: 0.10,
    totalCost: 50.00,
    purchaseDate: "2026-01-20T08:45:00Z",
    paymentMethod: "Amex •••• 2468",
    status: "completed"
  },
  {
    id: "payg-009",
    userId: "user-901",
    planId: "basic",
    minutesPurchased: 60,
    ratePerMinute: 0.25,
    totalCost: 15.00,
    purchaseDate: "2026-01-19T15:50:00Z",
    paymentMethod: "Visa •••• 1357",
    status: "completed"
  },
  {
    id: "payg-010",
    userId: "user-432",
    planId: "pro",
    minutesPurchased: 250,
    ratePerMinute: 0.15,
    totalCost: 37.50,
    purchaseDate: "2026-01-19T12:30:00Z",
    paymentMethod: "Mastercard •••• 7890",
    status: "completed"
  }
];

// Mock user data (in real app, join with users table)
const MOCK_USERS: Record<string, { name: string; email: string }> = {
  "user-123": { name: "Sarah Johnson", email: "sarah.j@email.com" },
  "user-456": { name: "Michael Chen", email: "michael.c@email.com" },
  "user-789": { name: "Emma Davis", email: "emma.d@email.com" },
  "user-234": { name: "James Wilson", email: "james.w@email.com" },
  "user-567": { name: "Olivia Brown", email: "olivia.b@email.com" },
  "user-890": { name: "Noah Garcia", email: "noah.g@email.com" },
  "user-345": { name: "Ava Martinez", email: "ava.m@email.com" },
  "user-678": { name: "William Lee", email: "william.l@email.com" },
  "user-901": { name: "Sophia Rodriguez", email: "sophia.r@email.com" },
  "user-432": { name: "Liam Anderson", email: "liam.a@email.com" }
};

type TimeFilter = "today" | "week" | "month" | "all";

export function PayAsYouGoManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | "all">("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...MOCK_PAYG_TRANSACTIONS];

    // Time filter
    const now = new Date();
    if (timeFilter === "today") {
      filtered = filtered.filter(t => {
        const date = new Date(t.purchaseDate);
        return date.toDateString() === now.toDateString();
      });
    } else if (timeFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.purchaseDate) >= weekAgo);
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.purchaseDate) >= monthAgo);
    }

    // Plan filter
    if (selectedPlan !== "all") {
      filtered = filtered.filter(t => t.planId === selectedPlan);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => {
        const user = MOCK_USERS[t.userId];
        return (
          user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [searchQuery, selectedPlan, timeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalCost, 0);
    const totalMinutes = filteredTransactions.reduce((sum, t) => sum + t.minutesPurchased, 0);
    const uniqueCustomers = new Set(filteredTransactions.map(t => t.userId)).size;
    const avgPurchase = totalRevenue / (filteredTransactions.length || 1);

    // Calculate growth (compare current period to previous period)
    const prevPeriodTransactions = MOCK_PAYG_TRANSACTIONS.filter(t => {
      const date = new Date(t.purchaseDate);
      const now = new Date();
      if (timeFilter === "month") {
        const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= twoMonthsAgo && date < monthAgo;
      }
      return false;
    });
    const prevRevenue = prevPeriodTransactions.reduce((sum, t) => sum + t.totalCost, 0);
    const growth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalMinutes,
      uniqueCustomers,
      avgPurchase,
      growth,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions, timeFilter]);

  // Plan breakdown
  const planBreakdown = useMemo(() => {
    const breakdown: Record<PlanTier, { count: number; revenue: number; minutes: number }> = {
      free: { count: 0, revenue: 0, minutes: 0 },
      basic: { count: 0, revenue: 0, minutes: 0 },
      pro: { count: 0, revenue: 0, minutes: 0 },
      enterprise: { count: 0, revenue: 0, minutes: 0 }
    };

    filteredTransactions.forEach(t => {
      breakdown[t.planId].count++;
      breakdown[t.planId].revenue += t.totalCost;
      breakdown[t.planId].minutes += t.minutesPurchased;
    });

    return breakdown;
  }, [filteredTransactions]);

  const handleExport = () => {
    // In real app: generate CSV export
    alert("Exporting PAYG transactions to CSV...");
  };

  return (
    <AdminLayoutNew>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pay-As-You-Go Management</h1>
              <p className="text-muted-foreground">
                Track customer PAYG purchases and revenue analytics
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/package-manager">
                <Button 
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure PAYG Rates
                </Button>
              </Link>
              <Button 
                onClick={handleExport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: "today" as TimeFilter, label: "Today" },
            { value: "week" as TimeFilter, label: "Last 7 Days" },
            { value: "month" as TimeFilter, label: "Last 30 Days" },
            { value: "all" as TimeFilter, label: "All Time" }
          ].map(filter => (
            <Button
              key={filter.value}
              onClick={() => setTimeFilter(filter.value)}
              variant={timeFilter === filter.value ? "default" : "outline"}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              {stats.growth > 0 ? (
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs font-semibold">+{stats.growth.toFixed(1)}%</span>
                </div>
              ) : stats.growth < 0 ? (
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-xs font-semibold">{stats.growth.toFixed(1)}%</span>
                </div>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total PAYG Revenue</p>
            <p className="text-3xl font-bold text-green-700">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.transactionCount} transactions
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Unique Customers</p>
            <p className="text-3xl font-bold text-blue-700">
              {stats.uniqueCustomers}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Purchased PAYG credits
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Minutes Sold</p>
            <p className="text-3xl font-bold text-purple-700">
              {stats.totalMinutes.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(stats.totalMinutes / 60).toFixed(1)} hours
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Avg Purchase</p>
            <p className="text-3xl font-bold text-amber-700">
              ${stats.avgPurchase.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </Card>
        </div>

        {/* Plan Breakdown */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            Revenue by Plan Tier
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(["basic", "pro", "enterprise"] as PlanTier[]).map(planId => {
              const plan = SUBSCRIPTION_PLANS[planId];
              const data = planBreakdown[planId];
              const percentage = stats.totalRevenue > 0 
                ? (data.revenue / stats.totalRevenue * 100).toFixed(1) 
                : "0";

              return (
                <div 
                  key={planId}
                  className="p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{plan.displayName}</h4>
                      <p className="text-xs text-muted-foreground">
                        ${plan.payAsYouGoRate}/min
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-bold text-green-600">
                        ${data.revenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Transactions</span>
                      <span className="font-semibold">{data.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Minutes</span>
                      <span className="font-semibold">{data.minutes}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">% of Total</span>
                        <span className="font-bold text-purple-600">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Top PAYG Customers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              // Calculate top customers
              const customerStats = new Map<string, { name: string; email: string; totalSpent: number; transactions: number; minutesPurchased: number }>();
              
              filteredTransactions.forEach(t => {
                const existing = customerStats.get(t.userId) || { 
                  name: MOCK_USERS[t.userId]?.name || "Unknown", 
                  email: MOCK_USERS[t.userId]?.email || "",
                  totalSpent: 0, 
                  transactions: 0,
                  minutesPurchased: 0
                };
                customerStats.set(t.userId, {
                  ...existing,
                  totalSpent: existing.totalSpent + t.totalCost,
                  transactions: existing.transactions + 1,
                  minutesPurchased: existing.minutesPurchased + t.minutesPurchased
                });
              });

              const topCustomers = Array.from(customerStats.entries())
                .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
                .slice(0, 6);

              return topCustomers.map(([userId, stats], index) => (
                <div 
                  key={userId}
                  className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{stats.name}</p>
                        <p className="text-xs text-muted-foreground">{stats.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Total Spent</span>
                      <span className="font-bold text-green-600">${stats.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Transactions</span>
                      <span className="font-semibold">{stats.transactions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Minutes</span>
                      <span className="font-semibold">{stats.minutesPurchased}</span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </Card>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by customer name, email, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as PlanTier | "all")}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Minutes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Total Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No transactions found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const user = MOCK_USERS[transaction.userId];
                    const plan = SUBSCRIPTION_PLANS[transaction.planId];
                    const date = new Date(transaction.purchaseDate);

                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-muted-foreground">
                            {transaction.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{user?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                              <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{plan.displayName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{transaction.minutesPurchased}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            ${transaction.ratePerMinute.toFixed(2)}/min
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">
                            ${transaction.totalCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{transaction.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm">{date.toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Understanding PAYG Analytics</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• PAYG purchases are additional minutes bought after monthly credits are depleted</li>
                <li>• Each plan tier has different PAYG rates - higher tiers get better rates as a benefit</li>
                <li>• Free trial users cannot purchase PAYG minutes (they must upgrade first)</li>
                <li>• Growth percentage compares current period to previous equal period</li>
                <li>• Export feature generates CSV with all transaction details for accounting</li>
                <li>• To change PAYG rates per tier, click "Configure PAYG Rates" or visit Package Manager</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayoutNew>
  );
}
