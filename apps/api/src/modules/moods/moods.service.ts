import prisma from "../../lib/prisma";
import { CreateMoodInput } from "./moods.schema";

export async function createMood(userId: string, input: CreateMoodInput) {
  // Update user profile current mood as well
  await prisma.profiles.update({
    where: { id: userId },
    data: { current_mood: input.mood },
  });

  return prisma.mood_entries.create({
    data: {
      user_id: userId,
      mood: input.mood,
      intensity: input.intensity,
      activities: input.activities,
      notes: input.notes,
    },
  });
}

export async function getMoodsByUserId(userId: string) {
  return prisma.mood_entries.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
}

export async function getAllMoods() {
  return prisma.mood_entries.findMany({
    orderBy: { created_at: "desc" },
    include: {
      profiles: {
        select: {
          email: true,
          full_name: true,
        },
      },
    },
  });
}
