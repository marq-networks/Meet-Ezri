import { FastifyReply, FastifyRequest } from 'fastify';
import { getDashboardStats } from './admin.service';

export async function getDashboardStatsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const stats = await getDashboardStats();
    return reply.code(200).send(stats);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch dashboard stats' });
  }
}
