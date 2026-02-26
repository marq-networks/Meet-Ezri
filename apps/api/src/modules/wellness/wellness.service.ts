import prisma from '../../lib/prisma';
import { CreateWellnessToolInput, UpdateWellnessToolInput } from './wellness.schema';

export async function createWellnessTool(data: CreateWellnessToolInput & { created_by?: string }) {
  const { created_by, image_url, content, ...rest } = data;

  return prisma.wellness_tools.create({
    data: {
      title: data.title,
      category: data.category,
      description: data.description,
      duration_minutes: data.duration_minutes,
      difficulty: data.difficulty,
      is_premium: data.is_premium,
      status: data.status,
      icon: data.icon,
      content_url: image_url,
      ...(created_by ? {
        profiles: {
          connect: { id: created_by },
        }
      } : {}),
    },
  });
}

export async function getWellnessChallengesWithStats() {
  const [challenges, participation, completions] = await Promise.all([
    prisma.wellness_challenges.findMany({
      orderBy: { start_date: 'asc' },
    }),
    prisma.user_challenge_participation.groupBy({
      by: ['challenge_id'],
      _count: { user_id: true },
    }),
    prisma.user_challenge_participation.groupBy({
      by: ['challenge_id'],
      where: { is_completed: true },
      _count: { user_id: true },
    }),
  ]);

  const participantsMap = new Map<string, number>();
  participation.forEach((row) => {
    participantsMap.set(row.challenge_id, row._count.user_id);
  });

  const completionsMap = new Map<string, number>();
  completions.forEach((row) => {
    completionsMap.set(row.challenge_id, row._count.user_id);
  });

  return challenges.map((challenge) => {
    const participants = participantsMap.get(challenge.id) || 0;
    const completed = completionsMap.get(challenge.id) || 0;
    const completionRate = participants
      ? Math.round((completed / participants) * 100)
      : 0;

    return {
      ...challenge,
      participants,
      completionRate,
    };
  });
}

export async function getWellnessTools(userId: string, category?: string) {
  const where = category ? { category } : {};
  const tools = await prisma.wellness_tools.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: {
      profiles: {
        select: {
          full_name: true,
        }
      },
      favorite_wellness_tools: {
        where: { user_id: userId },
        select: { created_at: true }
      }
    }
  });

  return tools.map(tool => ({
    ...tool,
    is_favorite: tool.favorite_wellness_tools.length > 0,
    favorite_wellness_tools: undefined
  }));
}

export async function toggleWellnessToolFavorite(userId: string, toolId: string) {
  const tool = await prisma.wellness_tools.findUnique({
    where: { id: toolId }
  });

  if (!tool) {
    throw new Error('Wellness tool not found');
  }

  const existing = await prisma.favorite_wellness_tools.findUnique({
    where: {
      user_id_tool_id: {
        user_id: userId,
        tool_id: toolId
      }
    }
  });

  if (existing) {
    await prisma.favorite_wellness_tools.delete({
      where: {
        user_id_tool_id: {
          user_id: userId,
          tool_id: toolId
        }
      }
    });
    return { is_favorite: false };
  } else {
    await prisma.favorite_wellness_tools.create({
      data: {
        user_id: userId,
        tool_id: toolId
      }
    });
    return { is_favorite: true };
  }
}

export async function getWellnessToolById(userId: string, id: string) {
  const tool = await prisma.wellness_tools.findUnique({
    where: { id },
    include: {
      favorite_wellness_tools: {
        where: { user_id: userId }
      }
    }
  });

  if (!tool) return null;

  return {
    ...tool,
    is_favorite: tool.favorite_wellness_tools.length > 0,
    favorite_wellness_tools: undefined
  };
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

export async function startWellnessSession(userId: string, toolId: string) {
  // Check if profile exists
  const profile = await prisma.profiles.findUnique({
    where: { id: userId }
  });

  if (!profile) {
    throw new Error('User profile not found. Please complete onboarding.');
  }

  // Check if tool exists
  const tool = await prisma.wellness_tools.findUnique({
    where: { id: toolId }
  });

  if (!tool) {
    throw new Error('Wellness tool not found');
  }

  return prisma.user_wellness_progress.create({
    data: {
      user_id: userId,
      tool_id: toolId,
      duration_spent: 0,
      completed_at: null,
    },
  });
}

export async function completeWellnessSession(progressId: string, durationSpent: number, rating?: number) {
  return prisma.user_wellness_progress.update({
    where: { id: progressId },
    data: {
      duration_spent: durationSpent,
      feedback_rating: rating,
      completed_at: new Date(),
    },
  });
}

export async function getUserWellnessProgress(userId: string) {
  const progress = await prisma.user_wellness_progress.groupBy({
    by: ['tool_id'],
    where: { 
      user_id: userId,
      completed_at: { not: null },
      duration_spent: { gt: 0 }
    },
    _count: { tool_id: true },
    _sum: { duration_spent: true },
  });

  // Get tool details
  const tools = await prisma.wellness_tools.findMany({
    where: {
      id: { in: progress.map(p => p.tool_id) }
    }
  });

  return progress.map(p => {
    const tool = tools.find(t => t.id === p.tool_id);
    return {
      toolId: p.tool_id,
      toolTitle: tool?.title || 'Unknown Exercise',
      sessionsCompleted: p._count.tool_id,
      totalMinutes: Math.round((p._sum.duration_spent || 0) / 60), // Convert seconds to minutes
    };
  });
}

export async function getWellnessStats(userId: string) {
  const today = new Date();
  
  // 1. Time Ranges
  // Weekly: Last 4 Weeks
  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(today.getDate() - 28);
  
  // Monthly: Last 6 Months
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 5); // Current month + 5 previous = 6
  sixMonthsAgo.setDate(1); // Start of that month

  // Helper to group by week
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = d.getTime() - fourWeeksAgo.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  };

  // Fetch raw data (extended to 6 months for monthly chart)
  const [sessions, moodEntries, wellnessProgress, journalEntries, sleepEntries, socialPosts, socialComments] = await Promise.all([
    // AI Sessions
    prisma.app_sessions.findMany({
      where: {
        user_id: userId,
        started_at: { gte: sixMonthsAgo },
        ended_at: { not: null }
      },
      select: { started_at: true }
    }),
    // Mood Check-ins
    prisma.mood_entries.findMany({
      where: {
        user_id: userId,
        created_at: { gte: sixMonthsAgo }
      },
      select: { created_at: true, intensity: true }
    }),
    // Wellness Exercises
    prisma.user_wellness_progress.findMany({
      where: {
        user_id: userId,
        completed_at: { gte: sixMonthsAgo }
      },
      select: { completed_at: true }
    }),
    // Journal Entries (Changed to findMany for monthly chart)
    prisma.journal_entries.findMany({
      where: { 
        user_id: userId,
        created_at: { gte: sixMonthsAgo }
      },
      select: { created_at: true }
    }),
    // Sleep Entries (for Score - keep recent)
    prisma.sleep_entries.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10
    }),
    // Social Posts (for Score)
    prisma.community_posts.count({
      where: { user_id: userId }
    }),
    // Social Comments (for Score)
    prisma.community_comments.count({
      where: { user_id: userId }
    })
  ]);

  // --- 1. Weekly Progress Calculation ---
  const weeklyData = Array(4).fill(0).map((_, i) => ({
    name: `Week ${i + 1}`,
    sessions: 0,
    mood: 0,
    wellness: 0
  }));

  sessions.forEach(s => {
    if (s.started_at && new Date(s.started_at) >= fourWeeksAgo) {
      const week = getWeekNumber(s.started_at);
      if (week >= 0 && week < 4) weeklyData[week].sessions++;
    }
  });

  moodEntries.forEach(m => {
    if (new Date(m.created_at) >= fourWeeksAgo) {
      const week = getWeekNumber(m.created_at);
      if (week >= 0 && week < 4) weeklyData[week].mood++;
    }
  });

  wellnessProgress.forEach(w => {
    if (w.completed_at && new Date(w.completed_at) >= fourWeeksAgo) {
      const week = getWeekNumber(w.completed_at);
      if (week >= 0 && week < 4) weeklyData[week].wellness++;
    }
  });

  // --- 2. Monthly Activity Calculation ---
  // Generate last 6 months labels
  const monthlyActivity: { month: string; value: number; _key: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`; // Unique key for matching
    
    monthlyActivity.push({
      month: monthName,
      value: 0,
      _key: monthKey
    });
  }

  // Helper to find month index
  const incrementMonth = (date: Date) => {
    const d = new Date(date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const monthItem = monthlyActivity.find(m => m._key === key);
    if (monthItem) monthItem.value++;
  };

  sessions.forEach(s => s.started_at && incrementMonth(s.started_at));
  moodEntries.forEach(m => incrementMonth(m.created_at));
  wellnessProgress.forEach(w => w.completed_at && incrementMonth(w.completed_at));
  journalEntries.forEach(j => incrementMonth(j.created_at));

  // Clean up helper key
  const finalMonthlyActivity = monthlyActivity.map(({ _key, ...rest }) => rest);

  // --- 3. Wellness Score Calculation ---
  
  // Emotional: Avg mood intensity
  const recentMoods = moodEntries.filter(m => new Date(m.created_at) >= fourWeeksAgo);
  const avgMood = recentMoods.length > 0
    ? recentMoods.reduce((acc, curr) => acc + curr.intensity, 0) / recentMoods.length
    : 0;
  const emotionalScore = Math.min(avgMood * 10, 100);

  // Sleep: Avg quality
  const avgSleep = sleepEntries.length > 0
    ? sleepEntries.reduce((acc, curr) => acc + (curr.quality_rating || 0), 0) / sleepEntries.length
    : 0;
  const sleepScore = Math.min(avgSleep * 10, 100);

  // Social: Activity based
  const socialCount = socialPosts + socialComments;
  const socialScore = Math.min((socialCount / 5) * 100, 100);

  // Mental: Journals + Sessions + Wellness Exercises (Last 4 weeks for score freshness)
  const recentJournals = journalEntries.filter(j => new Date(j.created_at) >= fourWeeksAgo).length;
  const recentSessions = sessions.filter(s => s.started_at && new Date(s.started_at) >= fourWeeksAgo).length;
  const recentWellness = wellnessProgress.filter(w => w.completed_at && new Date(w.completed_at) >= fourWeeksAgo).length;
  
  const mentalCount = recentJournals + recentSessions + recentWellness;
  const mentalScore = Math.min((mentalCount / 5) * 100, 100);

  // Physical: Placeholder
  const physicalScore = 65; 

  const wellnessScore = [
    { subject: 'Emotional', A: Math.round(emotionalScore), fullMark: 100 },
    { subject: 'Mental', A: Math.round(mentalScore), fullMark: 100 },
    { subject: 'Physical', A: physicalScore, fullMark: 100 },
    { subject: 'Social', A: Math.round(socialScore), fullMark: 100 },
    { subject: 'Sleep', A: Math.round(sleepScore), fullMark: 100 },
  ];

  return {
    weeklyProgress: weeklyData,
    monthlyActivity: finalMonthlyActivity,
    wellnessScore
  };
}
