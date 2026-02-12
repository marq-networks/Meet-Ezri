import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { SUBSCRIPTION_PLANS, PlanTier } from "../../utils/subscriptionPlans";
import { Check, Loader2, Sparkles, Zap, Crown } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function OnboardingSubscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("trial");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") as PlanTier;
    if (storedPlan && SUBSCRIPTION_PLANS[storedPlan]) {
      setSelectedPlan(storedPlan);
    }
  }, []);

  const handleContinue = async () => {
    setIsProcessing(true);
    try {
      console.log("Processing subscription for plan:", selectedPlan);
      
      if (selectedPlan === "trial") {
        toast.info("Activating your free trial...");
        // For trial, just create subscription and move on
        const result = await api.billing.createSubscription({
          plan_type: "trial",
          billing_cycle: "monthly"
        });
        console.log("Trial subscription result:", result);
        
        // Update local profile/context if needed? 
        // The next page will likely fetch fresh data or we rely on backend.
        // Navigate to wellness baseline
        navigate("/onboarding/wellness-baseline");
      } else {
        toast.info("Redirecting to checkout...");
        // For paid plans, redirect to Stripe
        // We need to provide full URL for success/cancel
        const origin = window.location.origin;
        const successUrl = `${origin}/onboarding/wellness-baseline?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${origin}/onboarding/subscription`;

        const result = await api.billing.createSubscription({
          plan_type: selectedPlan,
          billing_cycle: "monthly",
          successUrl,
          cancelUrl
        });
        console.log("Paid subscription result:", result);

        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        } else if (result.subscription) {
          // Fallback if backend handled it without checkout (e.g. 100% coupon or error in logic)
          console.warn("Received subscription object for paid plan instead of checkout URL");
          navigate("/onboarding/wellness-baseline");
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription selection");
      setIsProcessing(false);
    }
  };

  const plans: PlanTier[] = ["trial", "core", "pro"];

  const planStyles: Record<string, { border: string; bg: string; badge: string; text: string }> = {
    gray: {
      border: "border-gray-500",
      bg: "bg-gray-500/5",
      badge: "bg-gray-500",
      text: "text-gray-500"
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500/5",
      badge: "bg-blue-500",
      text: "text-blue-500"
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-500/5",
      badge: "bg-purple-500",
      text: "text-purple-500"
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={8}
      title="Choose Your Plan"
      subtitle="Select the plan that best fits your wellness journey"
      showBack={true}
      onBack={() => navigate("/onboarding/profile")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {plans.map((tier) => {
            const plan = SUBSCRIPTION_PLANS[tier];
            const isSelected = selectedPlan === tier;
            const Icon = tier === 'pro' ? Crown : tier === 'core' ? Zap : Sparkles;
            const styles = planStyles[plan.color] || planStyles.gray;

            return (
              <motion.div
                key={tier}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-4 cursor-pointer relative overflow-hidden transition-all duration-200 border-2 ${
                    isSelected 
                      ? `${styles.border} ${styles.bg}` 
                      : "border-transparent hover:border-border/50 bg-card/50"
                  }`}
                  onClick={() => setSelectedPlan(tier)}
                >
                  {isSelected && (
                    <div className={`absolute top-0 right-0 p-1 ${styles.badge} rounded-bl-lg`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} text-white shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{plan.displayName}</h3>
                          <p className="text-sm text-muted-foreground">{plan.allowanceDescription}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {plan.price === 0 ? "$0" : `$${plan.price}`}
                          </div>
                          {plan.price > 0 && <div className="text-xs text-muted-foreground">/month</div>}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className={`w-3 h-3 ${styles.text}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <div className="text-xs text-muted-foreground mt-1 ml-5">
                            + {plan.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleContinue} 
            disabled={isProcessing}
            className="w-full md:w-auto min-w-[150px]"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
