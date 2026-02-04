import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Calendar,
  DollarSign,
  Package,
  Crown,
  Download,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  History
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { AppLayout } from "../../components/AppLayout";
import { SUBSCRIPTION_PLANS, formatMinutes } from "../../utils/subscriptionPlans";
import type { PlanTier, UserSubscription, UsageRecord } from "../../utils/subscriptionPlans";

export function Billing() {
  // Mock user subscription data (in real app, fetch from backend)
  const [userSubscription] = useState<UserSubscription>({
    userId: "user123",
    planId: "basic",
    status: "active",
    creditsRemaining: 145,
    creditsTotal: 200,
    billingCycle: {
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-01-31T23:59:59Z",
      renewsOn: "2024-02-01T00:00:00Z"
    },
    payAsYouGoCredits: 0,
    totalSpent: 25,
    usageHistory: [
      {
        id: "1",
        date: "2024-01-15T10:30:00Z",
        minutesUsed: 25,
        sessionType: "ai-avatar",
        avatarName: "Maya Chen",
        cost: 0
      },
      {
        id: "2",
        date: "2024-01-14T14:20:00Z",
        minutesUsed: 30,
        sessionType: "ai-avatar",
        avatarName: "Maya Chen",
        cost: 0
      }
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  });

  const currentPlan = SUBSCRIPTION_PLANS[userSubscription.planId];
  const usagePercentage = ((userSubscription.creditsTotal - userSubscription.creditsRemaining) / userSubscription.creditsTotal) * 100;
  const daysUntilRenewal = Math.ceil((new Date(userSubscription.billingCycle.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const [showPAYGModal, setShowPAYGModal] = useState(false);
  const [paygMinutes, setPaygMinutes] = useState(60);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const paygCost = currentPlan.payAsYouGoRate ? (currentPlan.payAsYouGoRate * paygMinutes) : 0;

  const handleBuyPAYG = () => {
    // In real app: process payment and add credits
    alert(`Purchase ${paygMinutes} minutes for $${paygCost.toFixed(2)}`);
    setShowPAYGModal(false);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your plan, view usage, and purchase additional minutes
          </p>
        </div>

        {/* Current Plan Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Current Plan Card */}
          <Card className="p-6 md:col-span-2 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentPlan.gradient} flex items-center justify-center`}>
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <h3 className="text-2xl font-bold">{currentPlan.displayName}</h3>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-purple-700">
                    ${currentPlan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>

            {/* Renewal Info */}
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm">
                <span className="font-medium">Renews in {daysUntilRenewal} days</span> 
                <span className="text-muted-foreground"> • Next billing: {new Date(userSubscription.billingCycle.renewsOn!).toLocaleDateString()}</span>
              </span>
            </div>
          </Card>

          {/* Credits Remaining Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Minutes Remaining</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-700">
                  {userSubscription.creditsRemaining}
                </span>
                <span className="text-lg text-blue-600">
                  / {userSubscription.creditsTotal} min
                </span>
              </div>
              {userSubscription.payAsYouGoCredits > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  + {userSubscription.payAsYouGoCredits} PAYG minutes
                </p>
              )}
            </div>

            {/* Usage Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {usagePercentage.toFixed(0)}% used this billing cycle
              </p>
            </div>

            {userSubscription.creditsRemaining <= 50 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  Running low on minutes. Consider purchasing more or upgrading your plan.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Pay-As-You-Go Section */}
        {currentPlan.payAsYouGoRate && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-900">Pay-As-You-Go Available</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Need more minutes this month? Purchase additional time at your discounted rate of 
                  <span className="font-bold"> ${currentPlan.payAsYouGoRate}/minute</span>.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white/60 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">30 minutes</p>
                    <p className="text-lg font-bold text-green-800">
                      ${(currentPlan.payAsYouGoRate * 30).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">60 minutes</p>
                    <p className="text-lg font-bold text-green-800">
                      ${(currentPlan.payAsYouGoRate * 60).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">120 minutes</p>
                    <p className="text-lg font-bold text-green-800">
                      ${(currentPlan.payAsYouGoRate * 120).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowPAYGModal(true)}
                className="ml-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Minutes
              </Button>
            </div>
          </Card>
        )}

        {/* Usage History */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold">Recent Sessions</h3>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {userSubscription.usageHistory.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Session with {record.avatarName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{record.minutesUsed} minutes</p>
                  <p className="text-sm text-muted-foreground">
                    {record.cost > 0 ? `$${record.cost.toFixed(2)}` : 'Included'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {userSubscription.usageHistory.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No sessions yet</p>
              <Link to="/app/meet">
                <Button className="mt-4">
                  Start Your First Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* All Available Plans */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Compare All Plans</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {(Object.keys(SUBSCRIPTION_PLANS) as PlanTier[]).filter(id => id !== 'free').map((planId) => {
              const plan = SUBSCRIPTION_PLANS[planId];
              const isCurrent = planId === userSubscription.planId;
              
              return (
                <div
                  key={planId}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCurrent 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-border bg-muted/30 hover:border-purple-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-3`}>
                    {planId === 'basic' && <Package className="w-5 h-5 text-white" />}
                    {planId === 'pro' && <Zap className="w-5 h-5 text-white" />}
                    {planId === 'enterprise' && <Crown className="w-5 h-5 text-white" />}
                  </div>
                  
                  <h4 className="font-bold mb-1">{plan.displayName}</h4>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  
                  <div className="mb-3 p-2 bg-background rounded-lg">
                    <p className="text-sm font-medium">{plan.credits} minutes/mo</p>
                    {plan.payAsYouGoRate && (
                      <p className="text-xs text-muted-foreground">
                        PAYG: ${plan.payAsYouGoRate}/min
                      </p>
                    )}
                  </div>

                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                      <Check className="w-4 h-4" />
                      Current Plan
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant={planId === 'pro' ? 'default' : 'outline'}
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      {SUBSCRIPTION_PLANS[planId].price > currentPlan.price ? 'Upgrade' : 'Switch'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* PAYG Purchase Modal */}
      <AnimatePresence>
        {showPAYGModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPAYGModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl p-8 max-w-md w-full border-2 border-green-500/30 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Buy Additional Minutes</h3>
                <p className="text-muted-foreground">
                  Your rate: <span className="font-bold text-green-600">${currentPlan.payAsYouGoRate}/minute</span>
                </p>
              </div>

              {/* Minutes Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">How many minutes?</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[30, 60, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setPaygMinutes(mins)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paygMinutes === mins
                          ? 'border-green-500 bg-green-50'
                          : 'border-border hover:border-green-300'
                      }`}
                    >
                      <p className="font-bold">{mins}</p>
                      <p className="text-xs text-muted-foreground">minutes</p>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="300"
                    step="15"
                    value={paygMinutes}
                    onChange={(e) => setPaygMinutes(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono font-bold text-lg w-16">{paygMinutes}m</span>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Minutes:</span>
                  <span className="font-semibold">{paygMinutes}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-semibold">${currentPlan.payAsYouGoRate}/min</span>
                </div>
                <div className="border-t border-green-300 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-green-900">Total:</span>
                  <span className="text-2xl font-bold text-green-700">${paygCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPAYGModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBuyPAYG}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Purchase
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl p-8 max-w-md w-full border-2 border-purple-500/30 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upgrade Your Plan</h3>
                <p className="text-muted-foreground">
                  Feature coming soon! You'll be able to upgrade, downgrade, or cancel your plan anytime.
                </p>
              </div>

              <Button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Got It
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
