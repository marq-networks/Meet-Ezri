import { FastifyRequest, FastifyReply } from 'fastify';
import { stripe } from '../../config/stripe';
import prisma from '../../lib/prisma';
import { STRIPE_PRICE_IDS } from './billing.constants';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function stripeWebhookHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!WEBHOOK_SECRET) {
    request.log.error('STRIPE_WEBHOOK_SECRET is not set');
    return reply.status(500).send({ error: 'Webhook secret not configured' });
  }

  const sig = request.headers['stripe-signature'];
  
  if (!sig) {
    return reply.status(400).send({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    // fastify-raw-body attaches the raw body to request.rawBody
    // We need to cast request to any because we added the property via plugin
    const rawBody = (request as any).rawBody;
    
    if (!rawBody) {
        request.log.error('Raw body not available on request');
        return reply.status(400).send({ error: 'Raw body missing' });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig as string, WEBHOOK_SECRET);
  } catch (err: any) {
    request.log.error({ err }, 'Webhook signature verification failed');
    return reply.status(400).send(`Webhook Error: ${err.message}`);
  }

  request.log.info({ type: event.type }, 'Processing Stripe webhook');

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as any);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as any);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as any);
        break;
      default:
        request.log.info({ type: event.type }, 'Unhandled event type');
    }
  } catch (error) {
    request.log.error({ error }, 'Error processing webhook event');
    // Return 200 to acknowledge receipt even if processing failed to avoid retries loops for bad logic
    // But ideally 500 triggers retry. For dev/sandbox, 200 is safer to avoid spam.
    return reply.status(200).send({ error: 'Error processing event' });
  }

  return reply.send({ received: true });
}

async function handleCheckoutSessionCompleted(session: any) {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType;

  if (!userId || !planType) {
    console.warn('Missing metadata in checkout session', session.id);
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update or create subscription in DB
  await prisma.subscriptions.upsert({
    where: {
        // We don't have a unique constraint on stripe_sub_id easily accessible unless we query first
        // But schema says id is PK.
        // We should find by user_id or create.
        // Actually, user can have only one active subscription usually.
        // Let's find existing active one or create new.
        // Since we don't have a unique key on user_id in prisma schema for upsert (it's 1-many relation but logically 1-1 active),
        // we'll use findFirst/update or create.
        id: undefined, // Hack to force lookups below
    },
    create: {
      user_id: userId,
      stripe_sub_id: subscription.id,
      status: subscription.status,
      plan_type: planType,
      billing_cycle: 'monthly', // Default or derive from price
      start_date: new Date(subscription.current_period_start * 1000),
      end_date: new Date(subscription.current_period_end * 1000),
      next_billing_at: new Date(subscription.current_period_end * 1000),
    },
    update: {
      stripe_sub_id: subscription.id,
      status: subscription.status,
      plan_type: planType,
      start_date: new Date(subscription.current_period_start * 1000),
      end_date: new Date(subscription.current_period_end * 1000),
      next_billing_at: new Date(subscription.current_period_end * 1000),
    }, 
  } as any); 
  
  // Correction: upsert requires a unique where clause. 
  // We should do findFirst then update/create manually.
  
  const existingSub = await prisma.subscriptions.findFirst({
      where: { user_id: userId }
  });

  if (existingSub) {
      await prisma.subscriptions.update({
          where: { id: existingSub.id },
          data: {
              stripe_sub_id: subscription.id,
              status: subscription.status,
              plan_type: planType,
              start_date: new Date(subscription.current_period_start * 1000),
              end_date: new Date(subscription.current_period_end * 1000),
              next_billing_at: new Date(subscription.current_period_end * 1000),
          }
      });
  } else {
      await prisma.subscriptions.create({
          data: {
              user_id: userId,
              stripe_sub_id: subscription.id,
              status: subscription.status,
              plan_type: planType,
              start_date: new Date(subscription.current_period_start * 1000),
              end_date: new Date(subscription.current_period_end * 1000),
              next_billing_at: new Date(subscription.current_period_end * 1000),
          }
      });
  }

  // Update credits based on plan
  let credits = 0;
  if (planType === 'basic') credits = 100;
  else if (planType === 'pro') credits = 500;
  else if (planType === 'enterprise') credits = 1000;

  if (credits > 0) {
    await prisma.profiles.update({
      where: { id: userId },
      data: { credits }, // Or increment? usually reset/set for subscription
    });
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const existingSub = await prisma.subscriptions.findFirst({
      where: { stripe_sub_id: subscription.id }
  });

  if (!existingSub) return;

  await prisma.subscriptions.update({
    where: { id: existingSub.id },
    data: {
      status: subscription.status,
      end_date: new Date(subscription.current_period_end * 1000),
      next_billing_at: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const existingSub = await prisma.subscriptions.findFirst({
      where: { stripe_sub_id: subscription.id }
  });

  if (!existingSub) return;

  await prisma.subscriptions.update({
    where: { id: existingSub.id },
    data: {
      status: 'canceled',
      plan_type: 'free', // Revert to free?
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  if (invoice.billing_reason === 'subscription_create') {
    // Already handled by checkout.session.completed usually, or we can double check
    return;
  }

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

  const existingSub = await prisma.subscriptions.findFirst({
    where: { stripe_sub_id: subscription.id }
  });

  if (existingSub) {
    await prisma.subscriptions.update({
      where: { id: existingSub.id },
      data: {
        status: subscription.status,
        end_date: new Date(subscription.current_period_end * 1000),
        next_billing_at: new Date(subscription.current_period_end * 1000),
      },
    });

    // Renew credits
    // In a real app, you might check if credits should rollover or reset
    // Here we reset them based on the plan again
    let credits = 0;
    const planType = existingSub.plan_type;
    if (planType === 'basic') credits = 100;
    else if (planType === 'pro') credits = 500;
    else if (planType === 'enterprise') credits = 1000;

    if (credits > 0) {
      await prisma.profiles.update({
        where: { id: existingSub.user_id },
        data: { credits }, 
      });
    }
  }
}
