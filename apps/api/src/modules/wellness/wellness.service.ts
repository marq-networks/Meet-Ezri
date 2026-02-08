import { prisma } from '../../lib/prisma';
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
