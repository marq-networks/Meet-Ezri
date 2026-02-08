import { FastifyReply, FastifyRequest } from 'fastify';
import { createJournalEntry, deleteJournalEntry, getJournalEntries, getJournalEntryById, updateJournalEntry } from './journal.service';
import { CreateJournalInput, UpdateJournalInput } from './journal.schema';

export async function createJournalHandler(
  request: FastifyRequest<{ Body: CreateJournalInput }>,
  reply: FastifyReply
) {
  const user = request.user as { id: string };
  const journal = await createJournalEntry(user.id, request.body);
  return reply.code(201).send(journal);
}

export async function getJournalsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user as { id: string };
  const journals = await getJournalEntries(user.id);
  return reply.send(journals);
}

export async function getJournalByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = request.user as { id: string };
  const { id } = request.params;
  const journal = await getJournalEntryById(user.id, id);
  
  if (!journal) {
    return reply.code(404).send({ message: 'Journal entry not found' });
  }
  
  return reply.send(journal);
}

export async function updateJournalHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateJournalInput }>,
  reply: FastifyReply
) {
  const user = request.user as { id: string };
  const { id } = request.params;
  
  try {
    const journal = await updateJournalEntry(user.id, id, request.body);
    return reply.send(journal);
  } catch (error) {
    return reply.code(404).send({ message: 'Journal entry not found' });
  }
}

export async function getUserJournalsHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  const journals = await getJournalEntries(userId);
  return reply.send(journals);
}

export async function deleteJournalHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = request.user as { id: string };
  const { id } = request.params;
  
  try {
    await deleteJournalEntry(user.id, id);
    return reply.code(204).send();
  } catch (error) {
    return reply.code(404).send({ message: 'Journal entry not found' });
  }
}
