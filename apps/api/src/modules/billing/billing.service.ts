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
  // Since we don't have a separate invoices table yet, we'll return subscriptions as history
  // In a real app, you'd query an invoices table
  return prisma.subscriptions.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });
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
