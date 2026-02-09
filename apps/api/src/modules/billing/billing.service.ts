import prisma from '../../lib/prisma';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './billing.schema';

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

export async function createSubscription(userId: string, data: CreateSubscriptionInput) {
  // Cancel existing active subscriptions
  await prisma.subscriptions.updateMany({
    where: {
      user_id: userId,
      status: 'active',
    },
    data: {
      status: 'cancelled',
      end_date: new Date(),
    },
  });

  const amount = data.plan_type === 'basic' ? 25 : data.plan_type === 'pro' ? 59 : data.plan_type === 'enterprise' ? 149 : 0;
  
  const now = new Date();
  const nextBilling = new Date(now);
  if (data.billing_cycle === 'monthly') {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  } else {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  }

  return prisma.subscriptions.create({
    data: {
      user_id: userId,
      plan_type: data.plan_type,
      billing_cycle: data.billing_cycle,
      amount: amount,
      payment_method: data.payment_method,
      next_billing_at: nextBilling,
      status: 'active',
    },
  });
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
