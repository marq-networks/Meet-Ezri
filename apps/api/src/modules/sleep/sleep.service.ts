import { prisma } from '../../lib/prisma';
import { CreateSleepEntryInput, UpdateSleepEntryInput } from './sleep.schema';

export async function createSleepEntry(userId: string, data: CreateSleepEntryInput) {
  return prisma.sleep_entries.create({
    data: {
      user_id: userId,
      ...data,
    },
  });
}

export async function getSleepEntries(userId: string) {
  return prisma.sleep_entries.findMany({
    where: { user_id: userId },
    orderBy: { bed_time: 'desc' },
  });
}

export async function getSleepEntryById(userId: string, id: string) {
  return prisma.sleep_entries.findUnique({
    where: { id },
  });
}

export async function updateSleepEntry(userId: string, id: string, data: UpdateSleepEntryInput) {
  // Ensure user owns the entry
  const entry = await prisma.sleep_entries.findUnique({ where: { id } });
  if (!entry || entry.user_id !== userId) {
    throw new Error('Sleep entry not found or unauthorized');
  }

  return prisma.sleep_entries.update({
    where: { id },
    data,
  });
}

export async function deleteSleepEntry(userId: string, id: string) {
  // Ensure user owns the entry
  const entry = await prisma.sleep_entries.findUnique({ where: { id } });
  if (!entry || entry.user_id !== userId) {
    throw new Error('Sleep entry not found or unauthorized');
  }

  return prisma.sleep_entries.delete({
    where: { id },
  });
}
