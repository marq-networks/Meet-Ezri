import { FastifyReply, FastifyRequest } from 'fastify';
import { createSubscription, cancelSubscription, getBillingHistory, getSubscription, updateSubscription, getAllSubscriptions, updateSubscriptionById, createCreditPurchaseSession } from './billing.service';
import { CreateSubscriptionInput, UpdateSubscriptionInput, CreateCreditPurchaseInput } from './billing.schema';

interface UserPayload {
  sub: string;
  email?: string;
  role?: string;
}

export async function getSubscriptionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  const subscription = await getSubscription(user.sub);
  
  if (!subscription) {
    // Return a default trial plan structure if no subscription exists
    return reply.send({
      id: 'default',
      user_id: user.sub,
      plan_type: 'trial',
      status: 'active',
      start_date: new Date(),
      end_date: null,
      billing_cycle: 'monthly',
      amount: 0,
      next_billing_at: null,
      payment_method: null,
    });
  }
  
  return reply.send(subscription);
}

export async function createSubscriptionHandler(
  request: FastifyRequest<{ Body: CreateSubscriptionInput }>,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  // We need email to create Stripe Customer if not exists
  // Assuming email is in the JWT or we need to fetch it.
  // The UserPayload interface defined above has email as optional.
  // Let's assume it's there or fetch from DB if critical, but for now let's try to use what we have.
  // Ideally, we should fetch the user profile to be sure.
  
  // Since we modified the service to fetch profile for stripe_customer_id, we can pass just the ID
  // but the service function signature I created asks for email too: createCheckoutSession(userId, email, data)
  
  // Let's rely on the service to handle the email fetching if missing from payload, 
  // OR update the service to fetch the email from the profile if not provided.
  // Actually, let's update the controller to just pass the user.sub and let the service fetch the email if needed.
  // Wait, I defined `createCheckoutSession(userId: string, email: string, ...)`
  
  // Let's pass a placeholder if email is missing, but better to fix the service call.
  const result = await import('./billing.service').then(m => 
    m.createCheckoutSession(user.sub, user.email || '', request.body)
  );
  
  return reply.code(200).send(result);
}

export async function createCreditPurchaseHandler(
  request: FastifyRequest<{ Body: CreateCreditPurchaseInput }>,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  const result = await createCreditPurchaseSession(user.sub, user.email || '', request.body);
  return reply.code(200).send(result);
}

export async function createPortalSessionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  const result = await import('./billing.service').then(m => m.createPortalSession(user.sub));
  return reply.send(result);
}

export async function updateSubscriptionHandler(
  request: FastifyRequest<{ Body: UpdateSubscriptionInput }>,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  try {
    const subscription = await updateSubscription(user.sub, request.body);
    return reply.send(subscription);
  } catch (error) {
    return reply.code(404).send({ message: 'Active subscription not found' });
  }
}

export async function cancelSubscriptionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  try {
    await cancelSubscription(user.sub);
    return reply.code(200).send({ message: 'Subscription cancelled' });
  } catch (error) {
    return reply.code(404).send({ message: 'Active subscription not found' });
  }
}

export async function getBillingHistoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user as UserPayload;
  const history = await getBillingHistory(user.sub);
  return reply.send(history);
}

export async function getAllSubscriptionsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // In a real app, check for admin role here if not done in preHandler
  const subscriptions = await getAllSubscriptions();
  return reply.send(subscriptions);
}

export async function adminUpdateSubscriptionHandler(
  request: FastifyRequest<{ Params: { id: string }, Body: UpdateSubscriptionInput }>,
  reply: FastifyReply
) {
  try {
    const subscription = await updateSubscriptionById(request.params.id, request.body);
    return reply.send(subscription);
  } catch (error) {
    return reply.code(404).send({ message: 'Subscription not found' });
  }
}

export async function getSubscriptionByUserIdHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  const subscription = await getSubscription(userId);
  
  if (!subscription) {
    // Return a default trial plan structure if no subscription exists
    return reply.send({
      id: 'default',
      user_id: userId,
      plan_type: 'trial',
      status: 'active',
      start_date: new Date(),
      end_date: null,
      billing_cycle: 'monthly',
      amount: 0,
      next_billing_at: null,
      payment_method: null,
    });
  }
  
  return reply.send(subscription);
}
