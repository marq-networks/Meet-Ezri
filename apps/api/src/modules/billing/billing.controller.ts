import { FastifyReply, FastifyRequest } from 'fastify';
import { createSubscription, cancelSubscription, getBillingHistory, getSubscription, updateSubscription, getAllSubscriptions, updateSubscriptionById } from './billing.service';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './billing.schema';

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
    // Return a default free plan structure if no subscription exists
    return reply.send({
      id: 'default',
      user_id: user.sub,
      plan_type: 'free',
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
  const subscription = await createSubscription(user.sub, request.body);
  return reply.code(201).send(subscription);
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
    // Return a default free plan structure if no subscription exists
    return reply.send({
      id: 'default',
      user_id: userId,
      plan_type: 'free',
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
