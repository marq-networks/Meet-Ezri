import { FastifyReply, FastifyRequest } from 'fastify';
import { getDashboardStats, getAllUsers, getUserById, updateUser, deleteUser, getUserAuditLogs } from './admin.service';
import { updateUserSchema } from './admin.schema';
import { z } from 'zod';

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

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await getAllUsers();
    return reply.code(200).send(users);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch users' });
  }
}

export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const user = await getUserById(id);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    return reply.code(200).send(user);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch user' });
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{ Params: { id: string }, Body: z.infer<typeof updateUserSchema> }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const data = request.body;
    const user = await updateUser(id, data);
    return reply.code(200).send(user);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to update user' });
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    await deleteUser(id);
    return reply.code(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to delete user' });
  }
}

export async function getUserAuditLogsHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const logs = await getUserAuditLogs(id);
    return reply.code(200).send(logs);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch user audit logs' });
  }
}
