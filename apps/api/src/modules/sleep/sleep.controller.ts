import { FastifyReply, FastifyRequest } from 'fastify';
import { createSleepEntry, deleteSleepEntry, getSleepEntries, getSleepEntryById, updateSleepEntry } from './sleep.service';
import { CreateSleepEntryInput, UpdateSleepEntryInput } from './sleep.schema';

export async function createSleepEntryHandler(
  request: FastifyRequest<{ Body: CreateSleepEntryInput }>,
  reply: FastifyReply
) {
  const userId = request.user.id;
  const entry = await createSleepEntry(userId, request.body);
  return reply.code(201).send(entry);
}

export async function getSleepEntriesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.id;
  const entries = await getSleepEntries(userId);
  return reply.send(entries);
}

export async function getSleepEntryByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = request.user.id;
  const entry = await getSleepEntryById(userId, request.params.id);
  if (!entry) {
    return reply.code(404).send({ message: 'Sleep entry not found' });
  }
  if (entry.user_id !== userId) {
    return reply.code(403).send({ message: 'Unauthorized' });
  }
  return reply.send(entry);
}

export async function updateSleepEntryHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateSleepEntryInput }>,
  reply: FastifyReply
) {
  const userId = request.user.id;
  try {
    const entry = await updateSleepEntry(userId, request.params.id, request.body);
    return reply.send(entry);
  } catch (error) {
    return reply.code(404).send({ message: 'Sleep entry not found' });
  }
}

export async function getUserSleepEntriesHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  const entries = await getSleepEntries(userId);
  return reply.send(entries);
}

export async function deleteSleepEntryHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = request.user.id;
  try {
    await deleteSleepEntry(userId, request.params.id);
    return reply.code(204).send();
  } catch (error) {
    return reply.code(404).send({ message: 'Sleep entry not found' });
  }
}
