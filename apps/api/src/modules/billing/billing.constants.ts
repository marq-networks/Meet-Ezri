export const STRIPE_PRICE_IDS = {
  basic: 'price_1SzbZVBt6JG9FijPPF89RTfX',
  pro: 'price_1SzbZWBt6JG9FijPLyyUMEjh',
  enterprise: 'price_1SzbZYBt6JG9FijPjy6kfPCm',
} as const;

export const PLAN_LIMITS = {
  free: {
    credits: 100, // 100 minutes
    features: ['Basic Access', 'Limited AI Models'],
    payAsYouGoRate: null, // No PAYG
  },
  basic: {
    credits: 300, // 300 minutes
    features: ['Standard Access', 'All AI Models', 'Priority Support'],
    payAsYouGoRate: 0.25, // $0.25/min
  },
  pro: {
    credits: 1000, // 1000 minutes
    features: ['Premium Access', 'All AI Models', '24/7 Support', 'Advanced Analytics'],
    payAsYouGoRate: 0.15, // $0.15/min
  },
  enterprise: {
    credits: -1, // Unlimited
    features: ['Custom Solutions', 'Dedicated Account Manager', 'SLA'],
    payAsYouGoRate: 0.10, // $0.10/min
  },
};
