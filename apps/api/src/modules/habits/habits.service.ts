import prisma from "../../lib/prisma";
import { CreateHabitInput, UpdateHabitInput, LogHabitInput } from "./habits.schema";

export async function createHabit(userId: string, data: CreateHabitInput) {
  return prisma.habits.create({
    data: {
      name: data.name!,
      category: data.category,
      frequency: data.frequency,
      color: data.color,
      icon: data.icon,
      profiles: {
        connect: { id: userId },
      },
    },
  });
}

export async function getHabits(userId: string) {
  return prisma.habits.findMany({
    where: {
      user_id: userId,
      is_archived: false,
    },
    include: {
      habit_logs: {
        orderBy: {
          completed_at: 'desc',
        },
        take: 365, // Fetch enough history for streaks
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });
}

export async function updateHabit(userId: string, habitId: string, data: UpdateHabitInput) {
  // Verify ownership
  const habit = await prisma.habits.findFirst({
    where: { id: habitId, user_id: userId },
  });

  if (!habit) {
    throw new Error("Habit not found or unauthorized");
  }

  return prisma.habits.update({
    where: { id: habitId },
    data,
  });
}

export async function deleteHabit(userId: string, habitId: string) {
  // Verify ownership
  const habit = await prisma.habits.findFirst({
    where: { id: habitId, user_id: userId },
  });

  if (!habit) {
    throw new Error("Habit not found or unauthorized");
  }

  // Instead of hard delete, we might want to archive, but the requirement implies deletion capability.
  // The schema supports hard delete (cascade), so we can just delete.
  return prisma.habits.delete({
    where: { id: habitId },
  });
}

export async function logHabitCompletion(userId: string, habitId: string, data: LogHabitInput) {
  // Verify ownership
  const habit = await prisma.habits.findFirst({
    where: { id: habitId, user_id: userId },
  });

  if (!habit) {
    throw new Error("Habit not found or unauthorized");
  }

  const completedAt = data.completed_at ? new Date(data.completed_at) : new Date();

  // Check if already logged for this day (if frequency is daily)
  // Or just create a new log. The frontend requirement implies toggling.
  // If we want to toggle, we should check if a log exists for today.
  // But the service just "logs" it. We can have a separate "unlog" or "toggle" endpoint,
  // or handle it in the controller.
  // For simplicity, let's create a log. If the user wants to "uncomplete", they delete the log.
  
  return prisma.habit_logs.create({
    data: {
      habit_id: habitId,
      completed_at: completedAt,
    },
  });
}

export async function removeHabitCompletion(userId: string, habitId: string, dateStr: string) {
  // Verify ownership via habit
  const habit = await prisma.habits.findFirst({
    where: { id: habitId, user_id: userId },
  });

  if (!habit) {
    throw new Error("Habit not found or unauthorized");
  }

  // Find logs on that date
  const date = new Date(dateStr);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const logs = await prisma.habit_logs.findMany({
    where: {
      habit_id: habitId,
      completed_at: {
        gte: date,
        lt: nextDay,
      },
    },
  });

  if (logs.length > 0) {
    // Delete all logs for that day (in case of duplicates)
    await prisma.habit_logs.deleteMany({
      where: {
        id: {
          in: logs.map((l: typeof logs[number]) => l.id),
        },
      },
    });
    return { success: true, count: logs.length };
  }

  return { success: false, message: "No logs found for this date" };
}
