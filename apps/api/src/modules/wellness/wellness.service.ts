import prisma from '../../lib/prisma';
import { CreateWellnessToolInput, UpdateWellnessToolInput } from './wellness.schema';

export async function createWellnessTool(data: CreateWellnessToolInput & { created_by?: string }) {
  return prisma.wellness_tools.create({
    data,
  });
}

export async function getWellnessTools(category?: string) {
  const where = category ? { category } : {};
  return prisma.wellness_tools.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: {
      profiles: {
        select: {
          full_name: true,
        }
      }
    }
  });
}

export async function getWellnessToolById(id: string) {
  return prisma.wellness_tools.findUnique({
    where: { id },
  });
}

export async function updateWellnessTool(id: string, data: UpdateWellnessToolInput) {
  return prisma.wellness_tools.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

export async function deleteWellnessTool(id: string) {
  return prisma.wellness_tools.delete({
    where: { id },
  });
}

export async function trackWellnessProgress(userId: string, toolId: string, durationSpent: number, rating?: number) {
  return prisma.user_wellness_progress.create({
    data: {
      user_id: userId,
      tool_id: toolId,
      duration_spent: durationSpent,
      feedback_rating: rating,
      completed_at: new Date(),
    },
  });
}
