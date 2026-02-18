import prisma from '../../lib/prisma';
import { stripe } from '../../config/stripe';
import { STRIPE_PRICE_IDS, PLAN_LIMITS } from './billing.constants';
import { CreateSubscriptionInput, UpdateSubscriptionInput, CreateCreditPurchaseInput } from './billing.schema';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

async function getOrCreateStripeCustomer(userId: string, email: string) {
  const profile = await prisma.profiles.findUnique({ where: { id: userId } });
  
  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  await prisma.profiles.update({
    where: { id: userId },
    data: { stripe_customer_id: customer.id },
  });

  return customer.id;
}

export async function getSubscription(userId: string) {
  const sub = await prisma.subscriptions.findFirst({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  if (!sub) return null;

  const status = sub.status || '';
  const now = new Date();
  
  // If canceled and past end date, treat as no subscription (fall back to trial/free)
  if (['canceled', 'cancelled'].includes(status) && sub.end_date && sub.end_date < now) {
    return null;
  }
  
  // If incomplete_expired, treat as no subscription
  if (status === 'incomplete_expired') {
    return null;
  }

  // Check if the subscription is in a valid state to be considered "current"
  // We accept active, trialing, past_due. 
  // We also might want to return canceled if it's the most recent, so the UI can show "Canceled" instead of falling back to a default trial.
  return sub;
}

export async function createCheckoutSession(userId: string, email: string, data: CreateSubscriptionInput) {
  // Handle Trial Plan - Create subscription directly without Stripe
  if (data.plan_type === 'trial') {
    const existing = await prisma.subscriptions.findFirst({
      where: { user_id: userId }
    });

    const trialCredits = PLAN_LIMITS.trial.credits;

    if (existing) {
      const updated = await prisma.subscriptions.update({
        where: { id: existing.id },
        data: {
          plan_type: 'trial',
          status: 'active',
          billing_cycle: 'monthly',
          amount: 0,
          end_date: null, // Ongoing until upgraded or limits hit
        }
      });
      
      // Reset/Set credits for trial
      await prisma.profiles.update({
        where: { id: userId },
        data: { credits: trialCredits }
      });

      return { subscription: updated };
    }

    const subscription = await prisma.subscriptions.create({
      data: {
        user_id: userId,
        plan_type: 'trial',
        status: 'active',
        billing_cycle: 'monthly',
        amount: 0,
        start_date: new Date(),
      }
    });

    // Set credits for trial
    await prisma.profiles.update({
      where: { id: userId },
      data: { credits: trialCredits }
    });

    return { subscription };
  }

  const customerId = await getOrCreateStripeCustomer(userId, email);
  
  const priceId = STRIPE_PRICE_IDS[data.plan_type as keyof typeof STRIPE_PRICE_IDS];
  
  if (!priceId) {
    throw new Error('Invalid plan type');
  }

  // SAVE INTENT: Create a pending subscription in DB so UI knows what user selected
  const pendingSub = await prisma.subscriptions.create({
    data: {
      user_id: userId,
      plan_type: data.plan_type,
      status: 'incomplete', // Will be updated by webhook or sync
      billing_cycle: 'monthly',
      start_date: new Date(),
      // No end date yet
    }
  });

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      planType: data.plan_type,
      subscriptionId: pendingSub.id, // Link to our DB ID if useful
    },
    success_url: data.successUrl || `${CLIENT_URL}/app/billing?success=true`,
    cancel_url: data.cancelUrl || `${CLIENT_URL}/app/billing?canceled=true`,
  });

  return { checkoutUrl: session.url };
}

export async function createCreditPurchaseSession(userId: string, email: string, data: CreateCreditPurchaseInput) {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const subscription = await getSubscription(userId);
  const planType = (subscription?.plan_type || 'trial') as keyof typeof PLAN_LIMITS;
  
  // Get rate for plan, fallback to core if trial (or block if trial doesn't allow PAYG)
  // Currently trial plan has payAsYouGoRate: null, so we should probably block or use a standard rate
  // Let's use Core rate as standard for non-subscribers if we want to allow them to buy credits
  let rate = PLAN_LIMITS[planType]?.payAsYouGoRate;
  
  if (rate === null || rate === undefined) {
      // Trial plan does not include Pay-As-You-Go
      throw new Error('Pay-As-You-Go is only available for Core and Pro plans.');
  }

  const amountInCents = Math.round(data.credits * rate * 100);

  // Minimum Stripe amount is $0.50
  if (amountInCents < 50) {
      throw new Error('Minimum purchase amount is $0.50');
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${data.credits} Credits`,
            description: `One-time purchase of ${data.credits} credits at $${rate}/min`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      type: 'credits',
      credits: data.credits.toString(),
    },
    success_url: `${CLIENT_URL}/app/billing?success=true&credits=${data.credits}`,
    cancel_url: `${CLIENT_URL}/app/billing?canceled=true`,
  });

  return { checkoutUrl: session.url };
}

export async function createPortalSession(userId: string) {
  const profile = await prisma.profiles.findUnique({ where: { id: userId } });
  
  if (!profile?.stripe_customer_id) {
    throw new Error('No billing account found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${CLIENT_URL}/app/billing`,
  });

  return { portalUrl: session.url };
}

// Kept for backward compatibility or admin manual creation if needed
export async function createSubscription(userId: string, data: CreateSubscriptionInput) {
  // ... existing implementation if needed, or deprecate
  // For now, we will rely on webhooks to create the actual subscription record in DB
  // But to satisfy the controller signature if not changed yet:
  return { id: 'pending', status: 'pending' }; 
}

export async function updateSubscription(userId: string, data: UpdateSubscriptionInput) {
  const sub = await prisma.subscriptions.findFirst({
    where: { user_id: userId, status: 'active' },
  });

  if (!sub) {
    throw new Error('No active subscription found');
  }

  return prisma.subscriptions.update({
    where: { id: sub.id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

export async function updateSubscriptionById(id: string, data: UpdateSubscriptionInput) {
  return prisma.subscriptions.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

export async function cancelSubscription(userId: string) {
  const sub = await prisma.subscriptions.findFirst({
    where: { user_id: userId, status: 'active' },
  });

  if (!sub) {
    throw new Error('No active subscription found');
  }

  return prisma.subscriptions.update({
    where: { id: sub.id },
    data: {
      status: 'canceled',
      end_date: new Date(),
      updated_at: new Date(),
    },
  });
}

export async function getBillingHistory(userId: string) {
  return prisma.subscriptions.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });
}

export async function getInvoicesForUser(userId: string) {
  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: {
      stripe_customer_id: true,
    },
  });

  if (!profile?.stripe_customer_id) {
    return [];
  }

  const invoices = await stripe.invoices.list({
    customer: profile.stripe_customer_id,
    limit: 50,
  });

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    status: invoice.status,
    amount_due: (invoice.amount_due || 0) / 100,
    currency: invoice.currency,
    created: new Date(invoice.created * 1000).toISOString(),
    hosted_invoice_url: invoice.hosted_invoice_url || null,
    invoice_pdf: invoice.invoice_pdf || null,
    description: invoice.description || null,
  }));
}

export async function getAllSubscriptions() {
  return prisma.subscriptions.findMany({
    include: {
      profiles: {
        select: {
          email: true,
          full_name: true,
        }
      }
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getAllInvoices() {
  const invoices = await stripe.invoices.list({
    limit: 100,
  });

  const customerIds = Array.from(
    new Set(invoices.data.map((invoice) => invoice.customer).filter((id): id is string => typeof id === 'string'))
  );

  const profiles = await prisma.profiles.findMany({
    where: {
      stripe_customer_id: {
        in: customerIds,
      },
    },
    select: {
      id: true,
      email: true,
      full_name: true,
      stripe_customer_id: true,
    },
  });

  const profileByCustomerId = new Map<string, (typeof profiles)[number]>();
  for (const profile of profiles) {
    if (profile.stripe_customer_id) {
      profileByCustomerId.set(profile.stripe_customer_id, profile);
    }
  }

  return invoices.data.map((invoice) => {
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
    const profile = customerId ? profileByCustomerId.get(customerId) : undefined;

    return {
      id: invoice.id,
      status: invoice.status,
      amount_due: (invoice.amount_due || 0) / 100,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000).toISOString(),
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      invoice_pdf: invoice.invoice_pdf || null,
      description: invoice.description || null,
      user_id: profile?.id || null,
      user_email: profile?.email || null,
      user_name: profile?.full_name || null,
    };
  });
}

export async function syncSubscriptionWithStripe(userId: string) {
  const profile = await prisma.profiles.findUnique({ where: { id: userId } });
  
  if (!profile?.stripe_customer_id) {
    return getSubscription(userId);
  }

  // Fetch subscriptions from Stripe (active, trialing, incomplete)
  const stripeSubs = await stripe.subscriptions.list({
    customer: profile.stripe_customer_id,
    status: 'all', // Fetch all to be safe, then filter
    limit: 5,
  });

  // Find the most relevant subscription (active > trialing > incomplete)
  // Filter out canceled unless it's the only one? No, we want active/trialing.
  const validStatuses = ['active', 'trialing', 'incomplete', 'past_due'];
  const activeSub = stripeSubs.data.find(s => validStatuses.includes(s.status));

  if (!activeSub) {
    // No active subscription in Stripe
    return getSubscription(userId);
  }

  const priceId = activeSub.items.data[0].price.id;

  // Determine plan type from price ID
  let planType = 'trial';
  if (priceId === STRIPE_PRICE_IDS.core) planType = 'core';
  else if (priceId === STRIPE_PRICE_IDS.pro) planType = 'pro';
  else {
    if (activeSub.metadata?.planType) {
        planType = activeSub.metadata.planType;
    }
  }

  if (planType === 'trial') {
    return getSubscription(userId);
  }

  // Update DB
  // First try to find by stripe_sub_id
  let existingSub = await prisma.subscriptions.findFirst({
    where: { stripe_sub_id: activeSub.id }
  });

  // If not found by ID, find by user and most recent (likely the trial or pending one)
  if (!existingSub) {
    existingSub = await prisma.subscriptions.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
    });
  }

  let updatedSub;
  const subData = {
    stripe_sub_id: activeSub.id,
    status: activeSub.status,
    plan_type: planType,
    start_date: new Date(activeSub.current_period_start * 1000),
    end_date: new Date(activeSub.current_period_end * 1000),
    next_billing_at: new Date(activeSub.current_period_end * 1000),
    updated_at: new Date(),
  };

  if (existingSub) {
    updatedSub = await prisma.subscriptions.update({
        where: { id: existingSub.id },
        data: subData
    });
  } else {
    updatedSub = await prisma.subscriptions.create({
        data: {
            user_id: userId,
            ...subData,
            billing_cycle: 'monthly', // Default
        }
    });
  }

  // Sync Credits (Optional: Only if active/trialing)
  if (['active', 'trialing'].includes(activeSub.status)) {
      const limits = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS];
      if (limits) {
          // Check if we should update credits. 
          // For now, let's update if the plan matches.
          // In a real system, you'd check if credits were already allocated for this period.
          // But here, ensuring they have the credits is safer.
          await prisma.profiles.update({
              where: { id: userId },
              data: { credits: limits.credits }
          });
      }
  }

  return updatedSub;
}
