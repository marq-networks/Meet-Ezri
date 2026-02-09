import prisma from '../../lib/prisma';
import { stripe } from '../../config/stripe';
import { STRIPE_PRICE_IDS } from './billing.constants';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './billing.schema';

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
  return prisma.subscriptions.findFirst({
    where: {
      user_id: userId,
      status: 'active',
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function createCheckoutSession(userId: string, email: string, data: CreateSubscriptionInput) {
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
    success_url: `${CLIENT_URL}/app/billing?success=true`,
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
      status: 'cancelled',
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
