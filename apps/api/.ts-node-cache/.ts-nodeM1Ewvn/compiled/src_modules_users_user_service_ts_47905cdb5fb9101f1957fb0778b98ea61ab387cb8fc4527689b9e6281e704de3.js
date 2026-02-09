"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserEmail = getUserEmail;
exports.createProfile = createProfile;
exports.getProfile = getProfile;
exports.getCredits = getCredits;
exports.updateProfile = updateProfile;
exports.completeOnboarding = completeOnboarding;
exports.deleteUser = deleteUser;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const supabase_1 = require("../../config/supabase");
function calculateStreak(moodEntries) {
    if (!moodEntries || moodEntries.length === 0)
        return 0;
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
    if (diffDays > 1)
        return 0; // Streak broken
    streak = 1;
    let currentDate = lastEntryDate;
    for (let i = 1; i < sorted.length; i++) {
        const entryDate = new Date(sorted[i].created_at);
        entryDate.setHours(0, 0, 0, 0);
        const diff = Math.abs(currentDate.getTime() - entryDate.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            continue; // Same day entry
        if (days === 1) {
            streak++;
            currentDate = entryDate;
        }
        else {
            break;
        }
    }
    return streak;
}
async function getAllUsers() {
    const users = await prisma_1.default.profiles.findMany({
        orderBy: { created_at: 'desc' },
        include: {
            mood_entries: {
                orderBy: { created_at: 'desc' },
                take: 1
            },
            appointments_user: {
                where: { status: 'completed' }
            }
        }
    });
    return users.map(user => {
        // Calculate basic stats or risk level mock
        const lastActive = user.updated_at || user.created_at;
        const sessionCount = user.appointments_user.length;
        // Simple risk logic (mock)
        let riskLevel = 'low';
        const lastMood = user.mood_entries[0];
        if (lastMood && lastMood.mood === 'Sad' && lastMood.intensity > 8) {
            riskLevel = 'high';
        }
        else if (lastMood && lastMood.mood === 'Anxious') {
            riskLevel = 'medium';
        }
        return {
            id: user.id,
            name: user.full_name || user.email.split('@')[0],
            email: user.email,
            status: 'active', // In a real app, check auth status or soft delete
            joinDate: user.created_at,
            sessions: sessionCount,
            lastActive: lastActive,
            riskLevel: riskLevel,
            subscription: user.credits > 100 ? 'premium' : 'free', // Mock logic based on credits
            organization: 'Individual' // Mock
        };
    });
}
async function getUserEmail(userId) {
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId },
        select: { email: true }
    });
    return user?.email || null;
}
async function createProfile(userId, email, fullName) {
    return prisma_1.default.profiles.create({
        data: {
            id: userId,
            email,
            full_name: fullName || email.split('@')[0],
            role: 'user',
        },
    });
}
async function getProfile(userId) {
    const profile = await prisma_1.default.profiles.findUnique({
        where: { id: userId },
        include: {
            therapist_profiles: true,
            mood_entries: {
                orderBy: { created_at: 'desc' },
                take: 30,
            },
            appointments_user: {
                where: {
                    status: 'scheduled',
                    start_time: { gt: new Date() }
                }
            }
        },
    });
    if (!profile)
        return null;
    const [completedSessions, totalCheckins, totalJournals] = await Promise.all([
        prisma_1.default.appointments.count({
            where: {
                user_id: userId,
                status: 'completed'
            }
        }),
        prisma_1.default.mood_entries.count({
            where: {
                user_id: userId
            }
        }),
        prisma_1.default.journal_entries.count({
            where: {
                user_id: userId
            }
        })
    ]);
    const streakDays = calculateStreak(profile.mood_entries);
    const upcomingSessions = profile.appointments_user.length;
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
        credits_total: 200, // Mock value
        subscription_plan: 'Basic Plan', // Mock value
    };
}
async function getCredits(userId) {
    const profile = await prisma_1.default.profiles.findUnique({
        where: { id: userId },
        select: { credits: true }
    });
    return { credits: profile?.credits || 0 };
}
async function updateProfile(userId, data) {
    // console.log('Updating profile for user:', userId, 'Data:', data);
    return prisma_1.default.profiles.update({
        where: { id: userId },
        data: data,
    });
}
async function completeOnboarding(userId, data) {
    console.log('Completing onboarding for user:', userId, 'Data:', JSON.stringify(data, null, 2));
    const { role, license_number, specializations, languages, ...profileData } = data;
    // Update profile
    const profile = await prisma_1.default.profiles.upsert({
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
        await prisma_1.default.therapist_profiles.upsert({
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
async function deleteUser(userId) {
    // Delete from Prisma (application data)
    // We use a transaction or just delete. Deleting profile usually cascades to related tables in Prisma schema
    // But let's just delete the profile.
    try {
        await prisma_1.default.profiles.delete({
            where: { id: userId },
        });
    }
    catch (error) {
        // If record doesn't exist, we can proceed to delete from Auth
        console.warn(`Failed to delete profile for user ${userId}:`, error);
    }
    // Delete from Supabase Auth
    const { error } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
        throw new Error(`Failed to delete user from Supabase Auth: ${error.message}`);
    }
    return { success: true };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy91c2VyLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvdXNlcnMvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBNkNBLGtDQXlDQztBQUVELG9DQU1DO0FBRUQsc0NBU0M7QUFFRCxnQ0F3REM7QUFFRCxnQ0FNQztBQUVELHNDQU9DO0FBRUQsZ0RBcUNDO0FBRUQsZ0NBb0JDO0FBalBELDhEQUFzQztBQUN0QyxvREFBc0Q7QUFHdEQsU0FBUyxlQUFlLENBQUMsV0FBa0I7SUFDekMsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUV2RCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3pCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0IsbUVBQW1FO0lBQ25FLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFL0csdUVBQXVFO0lBQ3ZFLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU3RCxJQUFJLFFBQVEsR0FBRyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7SUFFNUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNYLElBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQztJQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqRCxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyRCxJQUFJLElBQUksS0FBSyxDQUFDO1lBQUUsU0FBUyxDQUFDLGlCQUFpQjtRQUMzQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNmLE1BQU0sRUFBRSxDQUFDO1lBQ1QsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUMxQixDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU07UUFDUixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFTSxLQUFLLFVBQVUsV0FBVztJQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUMzQyxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO1FBQy9CLE9BQU8sRUFBRTtZQUNQLFlBQVksRUFBRTtnQkFDWixPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO2dCQUMvQixJQUFJLEVBQUUsQ0FBQzthQUNSO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7YUFDL0I7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN0QiwyQ0FBMkM7UUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFFbkQsMkJBQTJCO1FBQzNCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDbEUsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUNyQixDQUFDO2FBQU0sSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNuRCxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxPQUFPO1lBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hELEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUUsUUFBUSxFQUFFLGtEQUFrRDtZQUNwRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDekIsUUFBUSxFQUFFLFlBQVk7WUFDdEIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSw4QkFBOEI7WUFDckYsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPO1NBQ25DLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsWUFBWSxDQUFDLE1BQWM7SUFDL0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDekMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtRQUNyQixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0tBQ3hCLENBQUMsQ0FBQztJQUNILE9BQU8sSUFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUM7QUFDN0IsQ0FBQztBQUVNLEtBQUssVUFBVSxhQUFhLENBQUMsTUFBYyxFQUFFLEtBQWEsRUFBRSxRQUFpQjtJQUNsRixPQUFPLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsTUFBTTtZQUNWLEtBQUs7WUFDTCxTQUFTLEVBQUUsUUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQy9DLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7UUFDckIsT0FBTyxFQUFFO1lBQ1Asa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtnQkFDL0IsSUFBSSxFQUFFLEVBQUU7YUFDVDtZQUNELGlCQUFpQixFQUFFO2dCQUNqQixLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFdBQVc7b0JBQ25CLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFO2lCQUMvQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsT0FBTztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRTFCLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQzFFLGdCQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUN4QixLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsTUFBTSxFQUFFLFdBQVc7YUFDcEI7U0FDRixDQUFDO1FBQ0YsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3hCLEtBQUssRUFBRTtnQkFDTCxPQUFPLEVBQUUsTUFBTTthQUNoQjtTQUNGLENBQUM7UUFDRixnQkFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7WUFDM0IsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO0lBRTFELE9BQU87UUFDTCxHQUFHLE9BQU87UUFDVixXQUFXLEVBQUUsVUFBVTtRQUN2QixpQkFBaUIsRUFBRSxnQkFBZ0I7UUFDbkMsS0FBSyxFQUFFO1lBQ0wsa0JBQWtCLEVBQUUsaUJBQWlCO1lBQ3JDLGNBQWMsRUFBRSxhQUFhO1lBQzdCLGNBQWMsRUFBRSxhQUFhO1lBQzdCLFdBQVcsRUFBRSxVQUFVO1NBQ3hCO1FBQ0QsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDO1FBQ3ZDLGFBQWEsRUFBRSxHQUFHLEVBQUssYUFBYTtRQUNwQyxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsYUFBYTtLQUMvQyxDQUFDO0FBQ0osQ0FBQztBQUVNLEtBQUssVUFBVSxVQUFVLENBQUMsTUFBYztJQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGdCQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUMvQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO1FBQ3JCLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7S0FDMUIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzVDLENBQUM7QUFFTSxLQUFLLFVBQVUsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUF3QjtJQUMxRSxvRUFBb0U7SUFFcEUsT0FBTyxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDNUIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtRQUNyQixJQUFJLEVBQUUsSUFBVztLQUNsQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGtCQUFrQixDQUFDLE1BQWMsRUFBRSxJQUFxQjtJQUM1RSxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0YsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxHQUFHLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsRixpQkFBaUI7SUFDakIsTUFBTSxPQUFPLEdBQUcsTUFBTSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDM0MsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtRQUNyQixNQUFNLEVBQUU7WUFDTixFQUFFLEVBQUUsTUFBTTtZQUNWLEdBQUcsV0FBVztZQUNkLElBQUk7U0FDTDtRQUNELE1BQU0sRUFBRTtZQUNOLEdBQUcsV0FBVztZQUNkLElBQUk7U0FDTDtLQUNGLENBQUMsQ0FBQztJQUVILGdEQUFnRDtJQUNoRCxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUUsQ0FBQztRQUN6QixNQUFNLGdCQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7WUFDckIsTUFBTSxFQUFFO2dCQUNOLEVBQUUsRUFBRSxNQUFNO2dCQUNWLGNBQWM7Z0JBQ2QsZUFBZSxFQUFFLGVBQWUsSUFBSSxFQUFFO2dCQUN0QyxTQUFTLEVBQUUsU0FBUyxJQUFJLEVBQUU7YUFDM0I7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sY0FBYztnQkFDZCxlQUFlLEVBQUUsZUFBZSxJQUFJLEVBQUU7Z0JBQ3RDLFNBQVMsRUFBRSxTQUFTLElBQUksRUFBRTthQUMzQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRU0sS0FBSyxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQzdDLHdDQUF3QztJQUN4Qyw0R0FBNEc7SUFDNUcscUNBQXFDO0lBQ3JDLElBQUksQ0FBQztRQUNILE1BQU0sZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZiw4REFBOEQ7UUFDOUQsT0FBTyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsTUFBTSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELDRCQUE0QjtJQUM1QixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSx3QkFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLElBQUksS0FBSyxFQUFFLENBQUM7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByaXNtYSBmcm9tICcuLi8uLi9saWIvcHJpc21hJztcclxuaW1wb3J0IHsgc3VwYWJhc2VBZG1pbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9zdXBhYmFzZSc7XHJcbmltcG9ydCB7IE9uYm9hcmRpbmdJbnB1dCwgVXBkYXRlUHJvZmlsZUlucHV0IH0gZnJvbSAnLi91c2VyLnNjaGVtYSc7XHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVTdHJlYWsobW9vZEVudHJpZXM6IGFueVtdKSB7XHJcbiAgaWYgKCFtb29kRW50cmllcyB8fCBtb29kRW50cmllcy5sZW5ndGggPT09IDApIHJldHVybiAwO1xyXG5cclxuICBsZXQgc3RyZWFrID0gMDtcclxuICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgXHJcbiAgLy8gU29ydCBieSBkYXRlIGRlc2MganVzdCBpbiBjYXNlLCB0aG91Z2ggREIgcXVlcnkgc2hvdWxkIGhhbmRsZSBpdFxyXG4gIGNvbnN0IHNvcnRlZCA9IG1vb2RFbnRyaWVzLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGIuY3JlYXRlZF9hdCkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYS5jcmVhdGVkX2F0KS5nZXRUaW1lKCkpO1xyXG4gIFxyXG4gIC8vIENoZWNrIGlmIHRoZXJlJ3MgYW4gZW50cnkgZm9yIHRvZGF5IG9yIHllc3RlcmRheSB0byBzdGFydCB0aGUgc3RyZWFrXHJcbiAgY29uc3QgbGFzdEVudHJ5RGF0ZSA9IG5ldyBEYXRlKHNvcnRlZFswXS5jcmVhdGVkX2F0KTtcclxuICBsYXN0RW50cnlEYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gIFxyXG4gIGNvbnN0IGRpZmZUaW1lID0gTWF0aC5hYnModG9kYXkuZ2V0VGltZSgpIC0gbGFzdEVudHJ5RGF0ZS5nZXRUaW1lKCkpO1xyXG4gIGNvbnN0IGRpZmZEYXlzID0gTWF0aC5jZWlsKGRpZmZUaW1lIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTsgXHJcbiAgXHJcbiAgaWYgKGRpZmZEYXlzID4gMSkgcmV0dXJuIDA7IC8vIFN0cmVhayBicm9rZW5cclxuXHJcbiAgc3RyZWFrID0gMTtcclxuICBsZXQgY3VycmVudERhdGUgPSBsYXN0RW50cnlEYXRlO1xyXG5cclxuICBmb3IgKGxldCBpID0gMTsgaSA8IHNvcnRlZC5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZW50cnlEYXRlID0gbmV3IERhdGUoc29ydGVkW2ldLmNyZWF0ZWRfYXQpO1xyXG4gICAgZW50cnlEYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgXHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoY3VycmVudERhdGUuZ2V0VGltZSgpIC0gZW50cnlEYXRlLmdldFRpbWUoKSk7XHJcbiAgICBjb25zdCBkYXlzID0gTWF0aC5jZWlsKGRpZmYgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgXHJcbiAgICBpZiAoZGF5cyA9PT0gMCkgY29udGludWU7IC8vIFNhbWUgZGF5IGVudHJ5XHJcbiAgICBpZiAoZGF5cyA9PT0gMSkge1xyXG4gICAgICBzdHJlYWsrKztcclxuICAgICAgY3VycmVudERhdGUgPSBlbnRyeURhdGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHN0cmVhaztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbFVzZXJzKCkge1xyXG4gIGNvbnN0IHVzZXJzID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRNYW55KHtcclxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXHJcbiAgICBpbmNsdWRlOiB7XHJcbiAgICAgIG1vb2RfZW50cmllczoge1xyXG4gICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXHJcbiAgICAgICAgdGFrZTogMVxyXG4gICAgICB9LFxyXG4gICAgICBhcHBvaW50bWVudHNfdXNlcjoge1xyXG4gICAgICAgIHdoZXJlOiB7IHN0YXR1czogJ2NvbXBsZXRlZCcgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB1c2Vycy5tYXAodXNlciA9PiB7XHJcbiAgICAvLyBDYWxjdWxhdGUgYmFzaWMgc3RhdHMgb3IgcmlzayBsZXZlbCBtb2NrXHJcbiAgICBjb25zdCBsYXN0QWN0aXZlID0gdXNlci51cGRhdGVkX2F0IHx8IHVzZXIuY3JlYXRlZF9hdDtcclxuICAgIGNvbnN0IHNlc3Npb25Db3VudCA9IHVzZXIuYXBwb2ludG1lbnRzX3VzZXIubGVuZ3RoO1xyXG4gICAgXHJcbiAgICAvLyBTaW1wbGUgcmlzayBsb2dpYyAobW9jaylcclxuICAgIGxldCByaXNrTGV2ZWwgPSAnbG93JztcclxuICAgIGNvbnN0IGxhc3RNb29kID0gdXNlci5tb29kX2VudHJpZXNbMF07XHJcbiAgICBpZiAobGFzdE1vb2QgJiYgbGFzdE1vb2QubW9vZCA9PT0gJ1NhZCcgJiYgbGFzdE1vb2QuaW50ZW5zaXR5ID4gOCkge1xyXG4gICAgICByaXNrTGV2ZWwgPSAnaGlnaCc7XHJcbiAgICB9IGVsc2UgaWYgKGxhc3RNb29kICYmIGxhc3RNb29kLm1vb2QgPT09ICdBbnhpb3VzJykge1xyXG4gICAgICByaXNrTGV2ZWwgPSAnbWVkaXVtJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpZDogdXNlci5pZCxcclxuICAgICAgbmFtZTogdXNlci5mdWxsX25hbWUgfHwgdXNlci5lbWFpbC5zcGxpdCgnQCcpWzBdLFxyXG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcclxuICAgICAgc3RhdHVzOiAnYWN0aXZlJywgLy8gSW4gYSByZWFsIGFwcCwgY2hlY2sgYXV0aCBzdGF0dXMgb3Igc29mdCBkZWxldGVcclxuICAgICAgam9pbkRhdGU6IHVzZXIuY3JlYXRlZF9hdCxcclxuICAgICAgc2Vzc2lvbnM6IHNlc3Npb25Db3VudCxcclxuICAgICAgbGFzdEFjdGl2ZTogbGFzdEFjdGl2ZSxcclxuICAgICAgcmlza0xldmVsOiByaXNrTGV2ZWwsXHJcbiAgICAgIHN1YnNjcmlwdGlvbjogdXNlci5jcmVkaXRzID4gMTAwID8gJ3ByZW1pdW0nIDogJ2ZyZWUnLCAvLyBNb2NrIGxvZ2ljIGJhc2VkIG9uIGNyZWRpdHNcclxuICAgICAgb3JnYW5pemF0aW9uOiAnSW5kaXZpZHVhbCcgLy8gTW9ja1xyXG4gICAgfTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJFbWFpbCh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlcnMuZmluZFVuaXF1ZSh7XHJcbiAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICBzZWxlY3Q6IHsgZW1haWw6IHRydWUgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB1c2VyPy5lbWFpbCB8fCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvZmlsZSh1c2VySWQ6IHN0cmluZywgZW1haWw6IHN0cmluZywgZnVsbE5hbWU/OiBzdHJpbmcpIHtcclxuICByZXR1cm4gcHJpc21hLnByb2ZpbGVzLmNyZWF0ZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIGlkOiB1c2VySWQsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBmdWxsX25hbWU6IGZ1bGxOYW1lIHx8IGVtYWlsLnNwbGl0KCdAJylbMF0sXHJcbiAgICAgIHJvbGU6ICd1c2VyJyxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQcm9maWxlKHVzZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlcy5maW5kVW5pcXVlKHtcclxuICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgIGluY2x1ZGU6IHtcclxuICAgICAgdGhlcmFwaXN0X3Byb2ZpbGVzOiB0cnVlLFxyXG4gICAgICBtb29kX2VudHJpZXM6IHtcclxuICAgICAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6ICdkZXNjJyB9LFxyXG4gICAgICAgIHRha2U6IDMwLFxyXG4gICAgICB9LFxyXG4gICAgICBhcHBvaW50bWVudHNfdXNlcjoge1xyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICBzdGF0dXM6ICdzY2hlZHVsZWQnLFxyXG4gICAgICAgICAgc3RhcnRfdGltZTogeyBndDogbmV3IERhdGUoKSB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICBpZiAoIXByb2ZpbGUpIHJldHVybiBudWxsO1xyXG5cclxuICBjb25zdCBbY29tcGxldGVkU2Vzc2lvbnMsIHRvdGFsQ2hlY2tpbnMsIHRvdGFsSm91cm5hbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgcHJpc21hLmFwcG9pbnRtZW50cy5jb3VudCh7XHJcbiAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgdXNlcl9pZDogdXNlcklkLFxyXG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCdcclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBwcmlzbWEubW9vZF9lbnRyaWVzLmNvdW50KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VySWRcclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBwcmlzbWEuam91cm5hbF9lbnRyaWVzLmNvdW50KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VySWRcclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdKTtcclxuXHJcbiAgY29uc3Qgc3RyZWFrRGF5cyA9IGNhbGN1bGF0ZVN0cmVhayhwcm9maWxlLm1vb2RfZW50cmllcyk7XHJcbiAgY29uc3QgdXBjb21pbmdTZXNzaW9ucyA9IHByb2ZpbGUuYXBwb2ludG1lbnRzX3VzZXIubGVuZ3RoO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucHJvZmlsZSxcclxuICAgIHN0cmVha19kYXlzOiBzdHJlYWtEYXlzLFxyXG4gICAgdXBjb21pbmdfc2Vzc2lvbnM6IHVwY29taW5nU2Vzc2lvbnMsXHJcbiAgICBzdGF0czoge1xyXG4gICAgICBjb21wbGV0ZWRfc2Vzc2lvbnM6IGNvbXBsZXRlZFNlc3Npb25zLFxyXG4gICAgICB0b3RhbF9jaGVja2luczogdG90YWxDaGVja2lucyxcclxuICAgICAgdG90YWxfam91cm5hbHM6IHRvdGFsSm91cm5hbHMsXHJcbiAgICAgIHN0cmVha19kYXlzOiBzdHJlYWtEYXlzXHJcbiAgICB9LFxyXG4gICAgY3JlZGl0c19yZW1haW5pbmc6IHByb2ZpbGUuY3JlZGl0cyB8fCAwLFxyXG4gICAgY3JlZGl0c190b3RhbDogMjAwLCAgICAvLyBNb2NrIHZhbHVlXHJcbiAgICBzdWJzY3JpcHRpb25fcGxhbjogJ0Jhc2ljIFBsYW4nLCAvLyBNb2NrIHZhbHVlXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENyZWRpdHModXNlcklkOiBzdHJpbmcpIHtcclxuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRVbmlxdWUoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxyXG4gICAgc2VsZWN0OiB7IGNyZWRpdHM6IHRydWUgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB7IGNyZWRpdHM6IHByb2ZpbGU/LmNyZWRpdHMgfHwgMCB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUHJvZmlsZSh1c2VySWQ6IHN0cmluZywgZGF0YTogVXBkYXRlUHJvZmlsZUlucHV0KSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1VwZGF0aW5nIHByb2ZpbGUgZm9yIHVzZXI6JywgdXNlcklkLCAnRGF0YTonLCBkYXRhKTtcclxuICBcclxuICByZXR1cm4gcHJpc21hLnByb2ZpbGVzLnVwZGF0ZSh7XHJcbiAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICBkYXRhOiBkYXRhIGFzIGFueSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBsZXRlT25ib2FyZGluZyh1c2VySWQ6IHN0cmluZywgZGF0YTogT25ib2FyZGluZ0lucHV0KSB7XHJcbiAgY29uc29sZS5sb2coJ0NvbXBsZXRpbmcgb25ib2FyZGluZyBmb3IgdXNlcjonLCB1c2VySWQsICdEYXRhOicsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpKTtcclxuICBjb25zdCB7IHJvbGUsIGxpY2Vuc2VfbnVtYmVyLCBzcGVjaWFsaXphdGlvbnMsIGxhbmd1YWdlcywgLi4ucHJvZmlsZURhdGEgfSA9IGRhdGE7XHJcblxyXG4gIC8vIFVwZGF0ZSBwcm9maWxlXHJcbiAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlcy51cHNlcnQoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxyXG4gICAgY3JlYXRlOiB7XHJcbiAgICAgIGlkOiB1c2VySWQsXHJcbiAgICAgIC4uLnByb2ZpbGVEYXRhLFxyXG4gICAgICByb2xlLFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZToge1xyXG4gICAgICAuLi5wcm9maWxlRGF0YSxcclxuICAgICAgcm9sZSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIC8vIElmIHRoZXJhcGlzdCwgY3JlYXRlL3VwZGF0ZSB0aGVyYXBpc3QgcHJvZmlsZVxyXG4gIGlmIChyb2xlID09PSAndGhlcmFwaXN0Jykge1xyXG4gICAgYXdhaXQgcHJpc21hLnRoZXJhcGlzdF9wcm9maWxlcy51cHNlcnQoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICAgIGNyZWF0ZToge1xyXG4gICAgICAgIGlkOiB1c2VySWQsXHJcbiAgICAgICAgbGljZW5zZV9udW1iZXIsXHJcbiAgICAgICAgc3BlY2lhbGl6YXRpb25zOiBzcGVjaWFsaXphdGlvbnMgfHwgW10sXHJcbiAgICAgICAgbGFuZ3VhZ2VzOiBsYW5ndWFnZXMgfHwgW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIGxpY2Vuc2VfbnVtYmVyLFxyXG4gICAgICAgIHNwZWNpYWxpemF0aW9uczogc3BlY2lhbGl6YXRpb25zIHx8IFtdLFxyXG4gICAgICAgIGxhbmd1YWdlczogbGFuZ3VhZ2VzIHx8IFtdLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0UHJvZmlsZSh1c2VySWQpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVXNlcih1c2VySWQ6IHN0cmluZykge1xyXG4gIC8vIERlbGV0ZSBmcm9tIFByaXNtYSAoYXBwbGljYXRpb24gZGF0YSlcclxuICAvLyBXZSB1c2UgYSB0cmFuc2FjdGlvbiBvciBqdXN0IGRlbGV0ZS4gRGVsZXRpbmcgcHJvZmlsZSB1c3VhbGx5IGNhc2NhZGVzIHRvIHJlbGF0ZWQgdGFibGVzIGluIFByaXNtYSBzY2hlbWFcclxuICAvLyBCdXQgbGV0J3MganVzdCBkZWxldGUgdGhlIHByb2ZpbGUuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHByaXNtYS5wcm9maWxlcy5kZWxldGUoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgLy8gSWYgcmVjb3JkIGRvZXNuJ3QgZXhpc3QsIHdlIGNhbiBwcm9jZWVkIHRvIGRlbGV0ZSBmcm9tIEF1dGhcclxuICAgIGNvbnNvbGUud2FybihgRmFpbGVkIHRvIGRlbGV0ZSBwcm9maWxlIGZvciB1c2VyICR7dXNlcklkfTpgLCBlcnJvcik7XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBTdXBhYmFzZSBBdXRoXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pbi5hdXRoLmFkbWluLmRlbGV0ZVVzZXIodXNlcklkKTtcclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRlbGV0ZSB1c2VyIGZyb20gU3VwYWJhc2UgQXV0aDogJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG59XHJcbiJdfQ==