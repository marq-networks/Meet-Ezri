// Subscription Plan Types and Configuration

export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  displayName: string;
  price: number; // Monthly price in dollars
  credits: number; // Minutes per month
  payAsYouGoRate: number | null; // Price per minute for PAYG (null if not available)
  features: string[];
  popular?: boolean;
  trialDays?: number;
  color: string; // Brand color for UI
  gradient: string; // Gradient class
}

export const SUBSCRIPTION_PLANS: Record<PlanTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free Trial',
    displayName: 'Free Trial',
    price: 0,
    credits: 30, // 30 minutes trial
    payAsYouGoRate: null, // No PAYG on free trial
    trialDays: 7,
    color: 'gray',
    gradient: 'from-gray-500 to-gray-600',
    features: [
      '30 minutes with AI Avatar',
      '7-day trial period',
      'Basic mood tracking',
      'Limited journal entries',
      'Mobile app access'
    ]
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    displayName: 'Basic Plan',
    price: 25,
    credits: 200, // 200 minutes per month
    payAsYouGoRate: 0.25, // $0.25 per minute
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    features: [
      '200 minutes/month with AI Avatar',
      'Pay-as-you-go at $0.25/min',
      'Unlimited mood tracking',
      'Unlimited journal entries',
      'Basic wellness tools',
      'Email support',
      'Mobile app access'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Plan',
    price: 59,
    credits: 500, // 500 minutes per month
    payAsYouGoRate: 0.15, // $0.15 per minute (better rate)
    popular: true,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      '500 minutes/month with AI Avatar',
      'Pay-as-you-go at $0.15/min (40% savings)',
      'Priority AI response',
      'Advanced wellness insights',
      'Personalized recommendations',
      'Weekly progress reports',
      'Priority support',
      'Mobile app access'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise Plan',
    price: 149,
    credits: 1500, // 1500 minutes per month
    payAsYouGoRate: 0.10, // $0.10 per minute (best rate)
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    features: [
      '1,500 minutes/month with AI Avatar',
      'Pay-as-you-go at $0.10/min (60% savings)',
      'Premium AI avatars',
      'Dedicated account manager',
      'Custom wellness programs',
      'Team/family plan options',
      'Advanced analytics dashboard',
      '24/7 priority support',
      'API access'
    ]
  }
};

// User Subscription Interface
export interface UserSubscription {
  userId: string;
  planId: PlanTier;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  creditsRemaining: number; // Minutes left this billing cycle
  creditsTotal: number; // Total minutes for this plan
  billingCycle: {
    startDate: string; // ISO date
    endDate: string; // ISO date
    renewsOn: string | null; // ISO date or null if cancelled
  };
  payAsYouGoCredits: number; // Extra minutes purchased
  totalSpent: number; // Total amount spent
  usageHistory: UsageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  id: string;
  date: string; // ISO date
  minutesUsed: number;
  sessionType: 'ai-avatar' | 'therapist'; // For future therapist feature
  avatarName?: string;
  cost: number; // Cost of this session (0 for included minutes, PAYG rate for extra)
}

export interface PayAsYouGoPurchase {
  id: string;
  userId: string;
  planId: PlanTier;
  minutesPurchased: number;
  ratePerMinute: number;
  totalCost: number;
  purchaseDate: string; // ISO date
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

// Helper Functions
export function getAvailablePAYGRate(planId: PlanTier): number | null {
  return SUBSCRIPTION_PLANS[planId].payAsYouGoRate;
}

export function canUsePAYG(planId: PlanTier): boolean {
  return planId !== 'free' && SUBSCRIPTION_PLANS[planId].payAsYouGoRate !== null;
}

export function calculatePAYGCost(planId: PlanTier, minutes: number): number {
  const rate = getAvailablePAYGRate(planId);
  if (!rate) return 0;
  return rate * minutes;
}

export function getRemainingTrialDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, 7 - diffDays);
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} mins`;
}

export function isSubscriptionActive(subscription: UserSubscription): boolean {
  const now = new Date();
  const endDate = new Date(subscription.billingCycle.endDate);
  return subscription.status === 'active' && now <= endDate;
}

export function shouldWarnLowCredits(creditsRemaining: number): boolean {
  return creditsRemaining <= 10 && creditsRemaining > 0;
}

export function hasCreditsRemaining(subscription: UserSubscription): boolean {
  return subscription.creditsRemaining > 0 || subscription.payAsYouGoCredits > 0;
}
