import { useState, useEffect } from "react";
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
import { api } from "../../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

export function Billing() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);

  const [showPAYGModal, setShowPAYGModal] = useState(false);
  const [paygMinutes, setPaygMinutes] = useState(60);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      try {
        setIsLoading(true);
        const [subData, sessionsData] = await Promise.all([
          api.billing.getSubscription(),
          api.sessions.getSessions()
        ]);

        const planId = (subData.plan_type as PlanTier) || 'free';
        const plan = SUBSCRIPTION_PLANS[planId];
        
        // Calculate usage from sessions
        // Filter sessions in current billing cycle (assuming monthly starting from created_at or last billing)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const currentCycleSessions = sessionsData.filter((s: any) => new Date(s.start_time) >= startOfMonth);
        const minutesUsed = currentCycleSessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
        
        const usageHistory: UsageRecord[] = sessionsData.map((s: any) => ({
          id: s.id,
          date: s.start_time,
          minutesUsed: s.duration || 0,
          sessionType: 'ai-avatar',
          avatarName: 'AI Companion', // Backend doesn't return avatar name yet in session list clearly?
          cost: 0 // Mock cost
        })).slice(0, 5); // Last 5 sessions

        const subscription: UserSubscription = {
          userId: subData.user_id,
          planId: planId,
          status: subData.status as any,
          creditsRemaining: Math.max(0, plan.credits - minutesUsed),
          creditsTotal: plan.credits,
          billingCycle: {
            startDate: subData.start_date || new Date().toISOString(),
            endDate: subData.next_billing_at || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
            renewsOn: subData.next_billing_at
          },
          payAsYouGoCredits: 0, // Not implemented in backend yet
          totalSpent: 0, // specific to invoices, skipped for now
          usageHistory,
          createdAt: subData.created_at || new Date().toISOString(),
          updatedAt: subData.updated_at || new Date().toISOString()
        };

        setUserSubscription(subscription);
      } catch (error) {
        console.error("Failed to fetch billing data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleUpgrade = async (planId: PlanTier) => {
    try {
      if (planId === userSubscription?.planId) return;
      
      if (userSubscription?.planId === 'free') {
        await api.billing.createSubscription({ plan_type: planId as any });
      } else {
        await api.billing.updateSubscription({ plan_type: planId as any });
      }
      
      // Reload data
      window.location.reload();
    } catch (error) {
      console.error("Failed to upgrade plan", error);
      alert("Failed to upgrade plan");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    try {
      await api.billing.cancelSubscription();
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel subscription", error);
    }
  };

  if (isLoading || !userSubscription) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[userSubscription.planId];
  const usagePercentage = ((userSubscription.creditsTotal - userSubscription.creditsRemaining) / userSubscription.creditsTotal) * 100;
  const daysUntilRenewal = userSubscription.billingCycle.renewsOn 
    ? Math.ceil((new Date(userSubscription.billingCycle.renewsOn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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
              <div className="flex flex-col gap-2">
                {currentPlan.id !== 'enterprise' && (
                    <Button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                    </Button>
                )}
                {userSubscription.planId !== 'free' && (
                    <Button 
                        variant="outline"
                        onClick={handleCancel}
                        className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                    >
                        Cancel Plan
                    </Button>
                )}
              </div>
            </div>

            {/* Renewal Info */}
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm">
                <span className="font-medium">
                    {userSubscription.status === 'active' ? `Renews in ${daysUntilRenewal} days` : 'Subscription Cancelled'}
                </span> 
                {userSubscription.billingCycle.renewsOn && (
                    <span className="text-muted-foreground"> • Next billing: {new Date(userSubscription.billingCycle.renewsOn).toLocaleDateString()}</span>
                )}
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
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold mb-1">{plan.displayName}</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-3">${plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                  <ul className="space-y-2 mb-4">
                    {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleUpgrade(planId)}
                    >
                        Switch to {plan.name}
                    </Button>
                  )}
                  {isCurrent && (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                          Current Plan
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
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Buy Extra Minutes</h3>
                <p className="text-muted-foreground">
                  Purchase additional time at ${currentPlan.payAsYouGoRate}/min
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Minutes to purchase</span>
                  <span className="font-bold text-2xl">{paygMinutes}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={paygMinutes}
                  onChange={(e) => setPaygMinutes(parseInt(e.target.value))}
                  className="w-full accent-green-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>30m</span>
                  <span>150m</span>
                  <span>300m</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="font-medium">Total Cost</span>
                <span className="text-2xl font-bold text-green-700">
                  ${paygCost.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPAYGModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={handleBuyPAYG}
                >
                  Confirm Purchase
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
              className="bg-background rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">Upgrade Your Plan</h3>
                <p className="text-muted-foreground">
                  Choose the plan that best fits your wellness journey
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {(Object.keys(SUBSCRIPTION_PLANS) as PlanTier[]).filter(id => id !== 'free').map((planId) => {
                  const plan = SUBSCRIPTION_PLANS[planId];
                  const isCurrent = planId === userSubscription.planId;
                  
                  return (
                    <div 
                      key={planId}
                      className={`relative p-6 rounded-xl border-2 ${
                        plan.popular 
                          ? 'border-purple-500 shadow-xl scale-105 z-10 bg-white' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      
                      <h4 className="text-xl font-bold mb-2">{plan.displayName}</h4>
                      <p className="text-3xl font-bold text-purple-700 mb-6">
                        ${plan.price}<span className="text-sm text-muted-foreground font-normal">/month</span>
                      </p>
                      
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        disabled={isCurrent}
                        onClick={() => handleUpgrade(planId)}
                      >
                        {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
