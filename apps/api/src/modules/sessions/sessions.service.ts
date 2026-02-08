import prisma from '../../lib/prisma';
import { CreateSessionInput, CreateMessageInput } from './sessions.schema';

export async function createSession(userId: string, input: CreateSessionInput) {
  try {
    // Ensure user profile exists to satisfy foreign key constraint
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!profile) {
      throw new Error('User profile not found. Please complete onboarding first.');
    }

    const result = await prisma.app_sessions.create({
      data: {
        user_id: userId,
        type: input.type,
        title: input.title || (input.type === 'instant' ? 'Instant Session' : 'Scheduled Session'),
        duration_minutes: input.duration_minutes,
        scheduled_at: input.scheduled_at,
        config: input.config as any, // Prisma Json type workaround
        status: input.type === 'instant' ? 'active' : 'scheduled',
        // For instant sessions, we assume they start immediately
        started_at: input.type === 'instant' ? new Date() : undefined,
      },
    });
    return result;
  } catch (error) {
    console.error('Error in createSession service:', error);
    throw error;
  }
}

export async function getSessions(userId: string, status?: string) {
  return prisma.app_sessions.findMany({
    where: {
      user_id: userId,
      ...(status ? { status } : {}),
    },
    include: {
      _count: {
        select: { session_messages: true }
      }
    },
    orderBy: {
      scheduled_at: 'desc', // Changed to desc to show recent sessions first
    },
  });
}

export async function endSession(userId: string, sessionId: string, durationSeconds?: number) {
  const session = await getSessionById(userId, sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  return prisma.app_sessions.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      ended_at: new Date(),
      // If durationSeconds is provided, update duration_minutes (rounded up)
      ...(durationSeconds !== undefined ? { duration_minutes: Math.ceil(durationSeconds / 60) } : {}),
    },
  });
}

export async function getSessionById(userId: string, sessionId: string) {
  return prisma.app_sessions.findFirst({
    where: {
      id: sessionId,
      user_id: userId,
    },
  });
}

export async function createMessage(userId: string, sessionId: string, input: CreateMessageInput) {
  const session = await getSessionById(userId, sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  return prisma.session_messages.create({
    data: {
      session_id: sessionId,
      role: input.role,
      content: input.content,
    },
  });
}

export async function getSessionTranscript(userId: string, sessionId: string) {
  const session = await getSessionById(userId, sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  return prisma.session_messages.findMany({
    where: { session_id: sessionId },
    orderBy: { created_at: 'asc' },
  });
}
