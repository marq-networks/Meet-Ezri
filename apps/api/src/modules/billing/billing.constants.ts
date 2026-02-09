export const STRIPE_PRICE_IDS = {
  basic: 'price_1Sz29BB5qq0CLLgHB9O2N4LW',
  pro: 'price_1Sz29DB5qq0CLLgH2hsCnYKV',
  enterprise: 'price_1Sz29FB5qq0CLLgHJeDRpAo4',
} as const;

export const PLAN_LIMITS = {
  free: {
    credits: 100, // 100 minutes
    features: ['Basic Access', 'Limited AI Models'],
  },
  basic: {
    credits: 300, // 300 minutes
    features: ['Standard Access', 'All AI Models', 'Priority Support'],
  },
  pro: {
    credits: 1000, // 1000 minutes
    features: ['Premium Access', 'All AI Models', '24/7 Support', 'Advanced Analytics'],
  },
  enterprise: {
    credits: -1, // Unlimited
    features: ['Custom Solutions', 'Dedicated Account Manager', 'SLA'],
  },
};
