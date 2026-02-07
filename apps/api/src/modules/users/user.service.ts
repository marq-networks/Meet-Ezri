import prisma from '../../lib/prisma';
import { supabaseAdmin } from '../../config/supabase';
import { OnboardingInput, UpdateProfileInput } from './user.schema';

function calculateStreak(moodEntries: any[]) {
  if (!moodEntries || moodEntries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Sort by date desc just in case, though DB query should handle it
  const sorted = moodEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Check if there's an entry for today or yesterday to start the streak
  const lastEntryDate = new Date(sorted[0].created_at);
  lastEntryDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today.getTime() - lastEntryDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays > 1) return 0; // Streak broken

  streak = 1;
  let currentDate = lastEntryDate;

  for (let i = 1; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].created_at);
    entryDate.setHours(0, 0, 0, 0);
    
    const diff = Math.abs(currentDate.getTime() - entryDate.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) continue; // Same day entry
    if (days === 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
}

export async function getUserEmail(userId: string): Promise<string | null> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { email: true }
  });
  return user?.email || null;
}

export async function createProfile(userId: string, email: string, fullName?: string) {
  return prisma.profiles.create({
    data: {
      id: userId,
      email,
      full_name: fullName || email.split('@')[0],
      role: 'user',
    },
  });
}

export async function getProfile(userId: string) {
  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    include: {
      therapist_profiles: true,
      mood_entries: {
        orderBy: { created_at: 'desc' },
        take: 30,
      },
      appointments_appointments_user_idToprofiles: {
        where: {
          status: 'scheduled',
          start_time: { gt: new Date() }
        }
      }
    },
  });

  if (!profile) return null;

  const [completedSessions, totalCheckins, totalJournals] = await Promise.all([
    prisma.appointments.count({
      where: {
        user_id: userId,
        status: 'completed'
      }
    }),
    prisma.mood_entries.count({
      where: {
        user_id: userId
      }
    }),
    prisma.journal_entries.count({
      where: {
        user_id: userId
      }
    })
  ]);

  const streakDays = calculateStreak(profile.mood_entries);
  const upcomingSessions = profile.appointments_appointments_user_idToprofiles.length;

  return {
    ...profile,
    streak_days: streakDays,
    upcoming_sessions: upcomingSessions,
    stats: {
      completed_sessions: completedSessions,
      total_checkins: totalCheckins,
      total_journals: totalJournals,
      streak_days: streakDays
    },
    credits_remaining: profile.credits || 0,
    credits_total: 200,    // Mock value
    subscription_plan: 'Basic Plan', // Mock value
  };
}

export async function getCredits(userId: string) {
  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { credits: true }
  });
  return { credits: profile?.credits || 0 };
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  // console.log('Updating profile for user:', userId, 'Data:', data);
  
  return prisma.profiles.update({
    where: { id: userId },
    data: data as any,
  });
}

export async function completeOnboarding(userId: string, data: OnboardingInput) {
  console.log('Completing onboarding for user:', userId, 'Data:', JSON.stringify(data, null, 2));
  const { role, license_number, specializations, languages, ...profileData } = data;

  // Update profile
  const profile = await prisma.profiles.upsert({
    where: { id: userId },
    create: {
      id: userId,
      ...profileData,
      role,
    },
    update: {
      ...profileData,
      role,
    },
  });

  // If therapist, create/update therapist profile
  if (role === 'therapist') {
    await prisma.therapist_profiles.upsert({
      where: { id: userId },
      create: {
        id: userId,
        license_number,
        specializations: specializations || [],
        languages: languages || [],
      },
      update: {
        license_number,
        specializations: specializations || [],
        languages: languages || [],
      },
    });
  }

  return getProfile(userId);
}

export async function deleteUser(userId: string) {
  // Delete from Prisma (application data)
  // We use a transaction or just delete. Deleting profile usually cascades to related tables in Prisma schema
  // But let's just delete the profile.
  try {
    await prisma.profiles.delete({
      where: { id: userId },
    });
  } catch (error) {
    // If record doesn't exist, we can proceed to delete from Auth
    console.warn(`Failed to delete profile for user ${userId}:`, error);
  }

  // Delete from Supabase Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Failed to delete user from Supabase Auth: ${error.message}`);
  }

  return { success: true };
}
