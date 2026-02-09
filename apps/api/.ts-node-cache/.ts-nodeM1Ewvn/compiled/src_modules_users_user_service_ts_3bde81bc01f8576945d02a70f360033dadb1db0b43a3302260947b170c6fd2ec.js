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
            },
            emergency_contacts: {
                orderBy: { created_at: 'desc' },
                take: 1
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy91c2VyLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvdXNlcnMvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBNkNBLGtDQXlDQztBQUVELG9DQU1DO0FBRUQsc0NBU0M7QUFFRCxnQ0E0REM7QUFFRCxnQ0FNQztBQUVELHNDQU9DO0FBRUQsZ0RBcUNDO0FBRUQsZ0NBb0JDO0FBclBELDhEQUFzQztBQUN0QyxvREFBc0Q7QUFHdEQsU0FBUyxlQUFlLENBQUMsV0FBa0I7SUFDekMsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUV2RCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3pCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0IsbUVBQW1FO0lBQ25FLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFL0csdUVBQXVFO0lBQ3ZFLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxhQUFh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QUFDO0FBQzVCLENBQUM7QUFFTSxLQUFLLFVBQVUsVUFBVSxDQUFDLE1BQWM7SUFDN0Msd0NBQXdDO0lBQ3hDLDRHQUE0RztJQUM1RyxxQ0FBcUM7SUFDckMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDM0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtTQUN0QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLDhEQUE4RDtRQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxNQUFNLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLHdCQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJpc21hIGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnO1xyXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnLi4vLi4vY29uZmlnL3N1cGFiYXNlJztcclxuaW1wb3J0IHsgT25ib2FyZGluZ0lucHV0LCBVcGRhdGVQcm9maWxlSW5wdXQgfSBmcm9tICcuL3VzZXIuc2NoZW1hJztcclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVN0cmVhayhtb29kRW50cmllczogYW55W10pIHtcclxuICBpZiAoIW1vb2RFbnRyaWVzIHx8IG1vb2RFbnRyaWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDA7XHJcblxyXG4gIGxldCBzdHJlYWsgPSAwO1xyXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICB0b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICBcclxuICAvLyBTb3J0IGJ5IGRhdGUgZGVzYyBqdXN0IGluIGNhc2UsIHRob3VnaCBEQiBxdWVyeSBzaG91bGQgaGFuZGxlIGl0XHJcbiAgY29uc3Qgc29ydGVkID0gbW9vZEVudHJpZXMuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYi5jcmVhdGVkX2F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLmNyZWF0ZWRfYXQpLmdldFRpbWUoKSk7XHJcbiAgXHJcbiAgLy8gQ2hlY2sgaWYgdGhlcmUncyBhbiBlbnRyeSBmb3IgdG9kYXkgb3IgeWVzdGVyZGF5IHRvIHN0YXJ0IHRoZSBzdHJlYWtcclxuICBjb25zdCBsYXN0RW50cnlEYXRlID0gbmV3IERhdGUoc29ydGVkWzBdLmNyZWF0ZWRfYXQpO1xyXG4gIGxhc3RFbnRyeURhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgXHJcbiAgY29uc3QgZGlmZlRpbWUgPSBNYXRoLmFicyh0b2RheS5nZXRUaW1lKCkgLSBsYXN0RW50cnlEYXRlLmdldFRpbWUoKSk7XHJcbiAgY29uc3QgZGlmZkRheXMgPSBNYXRoLmNlaWwoZGlmZlRpbWUgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpOyBcclxuICBcclxuICBpZiAoZGlmZkRheXMgPiAxKSByZXR1cm4gMDsgLy8gU3RyZWFrIGJyb2tlblxyXG5cclxuICBzdHJlYWsgPSAxO1xyXG4gIGxldCBjdXJyZW50RGF0ZSA9IGxhc3RFbnRyeURhdGU7XHJcblxyXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBlbnRyeURhdGUgPSBuZXcgRGF0ZShzb3J0ZWRbaV0uY3JlYXRlZF9hdCk7XHJcbiAgICBlbnRyeURhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBcclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBlbnRyeURhdGUuZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0IGRheXMgPSBNYXRoLmNlaWwoZGlmZiAvICgxMDAwICogNjAgKiA2MCAqIDI0KSk7XHJcbiAgICBcclxuICAgIGlmIChkYXlzID09PSAwKSBjb250aW51ZTsgLy8gU2FtZSBkYXkgZW50cnlcclxuICAgIGlmIChkYXlzID09PSAxKSB7XHJcbiAgICAgIHN0cmVhaysrO1xyXG4gICAgICBjdXJyZW50RGF0ZSA9IGVudHJ5RGF0ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gc3RyZWFrO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsVXNlcnMoKSB7XHJcbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBwcmlzbWEucHJvZmlsZXMuZmluZE1hbnkoe1xyXG4gICAgb3JkZXJCeTogeyBjcmVhdGVkX2F0OiAnZGVzYycgfSxcclxuICAgIGluY2x1ZGU6IHtcclxuICAgICAgbW9vZF9lbnRyaWVzOiB7XHJcbiAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkX2F0OiAnZGVzYycgfSxcclxuICAgICAgICB0YWtlOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIGFwcG9pbnRtZW50c191c2VyOiB7XHJcbiAgICAgICAgd2hlcmU6IHsgc3RhdHVzOiAnY29tcGxldGVkJyB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHVzZXJzLm1hcCh1c2VyID0+IHtcclxuICAgIC8vIENhbGN1bGF0ZSBiYXNpYyBzdGF0cyBvciByaXNrIGxldmVsIG1vY2tcclxuICAgIGNvbnN0IGxhc3RBY3RpdmUgPSB1c2VyLnVwZGF0ZWRfYXQgfHwgdXNlci5jcmVhdGVkX2F0O1xyXG4gICAgY29uc3Qgc2Vzc2lvbkNvdW50ID0gdXNlci5hcHBvaW50bWVudHNfdXNlci5sZW5ndGg7XHJcbiAgICBcclxuICAgIC8vIFNpbXBsZSByaXNrIGxvZ2ljIChtb2NrKVxyXG4gICAgbGV0IHJpc2tMZXZlbCA9ICdsb3cnO1xyXG4gICAgY29uc3QgbGFzdE1vb2QgPSB1c2VyLm1vb2RfZW50cmllc1swXTtcclxuICAgIGlmIChsYXN0TW9vZCAmJiBsYXN0TW9vZC5tb29kID09PSAnU2FkJyAmJiBsYXN0TW9vZC5pbnRlbnNpdHkgPiA4KSB7XHJcbiAgICAgIHJpc2tMZXZlbCA9ICdoaWdoJztcclxuICAgIH0gZWxzZSBpZiAobGFzdE1vb2QgJiYgbGFzdE1vb2QubW9vZCA9PT0gJ0FueGlvdXMnKSB7XHJcbiAgICAgIHJpc2tMZXZlbCA9ICdtZWRpdW0nO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICBuYW1lOiB1c2VyLmZ1bGxfbmFtZSB8fCB1c2VyLmVtYWlsLnNwbGl0KCdAJylbMF0sXHJcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICBzdGF0dXM6ICdhY3RpdmUnLCAvLyBJbiBhIHJlYWwgYXBwLCBjaGVjayBhdXRoIHN0YXR1cyBvciBzb2Z0IGRlbGV0ZVxyXG4gICAgICBqb2luRGF0ZTogdXNlci5jcmVhdGVkX2F0LFxyXG4gICAgICBzZXNzaW9uczogc2Vzc2lvbkNvdW50LFxyXG4gICAgICBsYXN0QWN0aXZlOiBsYXN0QWN0aXZlLFxyXG4gICAgICByaXNrTGV2ZWw6IHJpc2tMZXZlbCxcclxuICAgICAgc3Vic2NyaXB0aW9uOiB1c2VyLmNyZWRpdHMgPiAxMDAgPyAncHJlbWl1bScgOiAnZnJlZScsIC8vIE1vY2sgbG9naWMgYmFzZWQgb24gY3JlZGl0c1xyXG4gICAgICBvcmdhbml6YXRpb246ICdJbmRpdmlkdWFsJyAvLyBNb2NrXHJcbiAgICB9O1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckVtYWlsKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2Vycy5maW5kVW5pcXVlKHtcclxuICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgIHNlbGVjdDogeyBlbWFpbDogdHJ1ZSB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHVzZXI/LmVtYWlsIHx8IG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9maWxlKHVzZXJJZDogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBmdWxsTmFtZT86IHN0cmluZykge1xyXG4gIHJldHVybiBwcmlzbWEucHJvZmlsZXMuY3JlYXRlKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgaWQ6IHVzZXJJZCxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIGZ1bGxfbmFtZTogZnVsbE5hbWUgfHwgZW1haWwuc3BsaXQoJ0AnKVswXSxcclxuICAgICAgcm9sZTogJ3VzZXInLFxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFByb2ZpbGUodXNlcklkOiBzdHJpbmcpIHtcclxuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRVbmlxdWUoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxyXG4gICAgaW5jbHVkZToge1xyXG4gICAgICB0aGVyYXBpc3RfcHJvZmlsZXM6IHRydWUsXHJcbiAgICAgIG1vb2RfZW50cmllczoge1xyXG4gICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXHJcbiAgICAgICAgdGFrZTogMzAsXHJcbiAgICAgIH0sXHJcbiAgICAgIGFwcG9pbnRtZW50c191c2VyOiB7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgIHN0YXR1czogJ3NjaGVkdWxlZCcsXHJcbiAgICAgICAgICBzdGFydF90aW1lOiB7IGd0OiBuZXcgRGF0ZSgpIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGVtZXJnZW5jeV9jb250YWN0czoge1xyXG4gICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXHJcbiAgICAgICAgdGFrZTogMVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICBpZiAoIXByb2ZpbGUpIHJldHVybiBudWxsO1xyXG5cclxuICBjb25zdCBbY29tcGxldGVkU2Vzc2lvbnMsIHRvdGFsQ2hlY2tpbnMsIHRvdGFsSm91cm5hbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgcHJpc21hLmFwcG9pbnRtZW50cy5jb3VudCh7XHJcbiAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgdXNlcl9pZDogdXNlcklkLFxyXG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCdcclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBwcmlzbWEubW9vZF9lbnRyaWVzLmNvdW50KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VySWRcclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBwcmlzbWEuam91cm5hbF9lbnRyaWVzLmNvdW50KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VySWRcclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdKTtcclxuXHJcbiAgY29uc3Qgc3RyZWFrRGF5cyA9IGNhbGN1bGF0ZVN0cmVhayhwcm9maWxlLm1vb2RfZW50cmllcyk7XHJcbiAgY29uc3QgdXBjb21pbmdTZXNzaW9ucyA9IHByb2ZpbGUuYXBwb2ludG1lbnRzX3VzZXIubGVuZ3RoO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucHJvZmlsZSxcclxuICAgIHN0cmVha19kYXlzOiBzdHJlYWtEYXlzLFxyXG4gICAgdXBjb21pbmdfc2Vzc2lvbnM6IHVwY29taW5nU2Vzc2lvbnMsXHJcbiAgICBzdGF0czoge1xyXG4gICAgICBjb21wbGV0ZWRfc2Vzc2lvbnM6IGNvbXBsZXRlZFNlc3Npb25zLFxyXG4gICAgICB0b3RhbF9jaGVja2luczogdG90YWxDaGVja2lucyxcclxuICAgICAgdG90YWxfam91cm5hbHM6IHRvdGFsSm91cm5hbHMsXHJcbiAgICAgIHN0cmVha19kYXlzOiBzdHJlYWtEYXlzXHJcbiAgICB9LFxyXG4gICAgY3JlZGl0c19yZW1haW5pbmc6IHByb2ZpbGUuY3JlZGl0cyB8fCAwLFxyXG4gICAgY3JlZGl0c190b3RhbDogMjAwLCAgICAvLyBNb2NrIHZhbHVlXHJcbiAgICBzdWJzY3JpcHRpb25fcGxhbjogJ0Jhc2ljIFBsYW4nLCAvLyBNb2NrIHZhbHVlXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENyZWRpdHModXNlcklkOiBzdHJpbmcpIHtcclxuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRVbmlxdWUoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxyXG4gICAgc2VsZWN0OiB7IGNyZWRpdHM6IHRydWUgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB7IGNyZWRpdHM6IHByb2ZpbGU/LmNyZWRpdHMgfHwgMCB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUHJvZmlsZSh1c2VySWQ6IHN0cmluZywgZGF0YTogVXBkYXRlUHJvZmlsZUlucHV0KSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1VwZGF0aW5nIHByb2ZpbGUgZm9yIHVzZXI6JywgdXNlcklkLCAnRGF0YTonLCBkYXRhKTtcclxuICBcclxuICByZXR1cm4gcHJpc21hLnByb2ZpbGVzLnVwZGF0ZSh7XHJcbiAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICBkYXRhOiBkYXRhIGFzIGFueSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBsZXRlT25ib2FyZGluZyh1c2VySWQ6IHN0cmluZywgZGF0YTogT25ib2FyZGluZ0lucHV0KSB7XHJcbiAgY29uc29sZS5sb2coJ0NvbXBsZXRpbmcgb25ib2FyZGluZyBmb3IgdXNlcjonLCB1c2VySWQsICdEYXRhOicsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpKTtcclxuICBjb25zdCB7IHJvbGUsIGxpY2Vuc2VfbnVtYmVyLCBzcGVjaWFsaXphdGlvbnMsIGxhbmd1YWdlcywgLi4ucHJvZmlsZURhdGEgfSA9IGRhdGE7XHJcblxyXG4gIC8vIFVwZGF0ZSBwcm9maWxlXHJcbiAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlcy51cHNlcnQoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxyXG4gICAgY3JlYXRlOiB7XHJcbiAgICAgIGlkOiB1c2VySWQsXHJcbiAgICAgIC4uLnByb2ZpbGVEYXRhLFxyXG4gICAgICByb2xlLFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZToge1xyXG4gICAgICAuLi5wcm9maWxlRGF0YSxcclxuICAgICAgcm9sZSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIC8vIElmIHRoZXJhcGlzdCwgY3JlYXRlL3VwZGF0ZSB0aGVyYXBpc3QgcHJvZmlsZVxyXG4gIGlmIChyb2xlID09PSAndGhlcmFwaXN0Jykge1xyXG4gICAgYXdhaXQgcHJpc21hLnRoZXJhcGlzdF9wcm9maWxlcy51cHNlcnQoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICAgIGNyZWF0ZToge1xyXG4gICAgICAgIGlkOiB1c2VySWQsXHJcbiAgICAgICAgbGljZW5zZV9udW1iZXIsXHJcbiAgICAgICAgc3BlY2lhbGl6YXRpb25zOiBzcGVjaWFsaXphdGlvbnMgfHwgW10sXHJcbiAgICAgICAgbGFuZ3VhZ2VzOiBsYW5ndWFnZXMgfHwgW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIGxpY2Vuc2VfbnVtYmVyLFxyXG4gICAgICAgIHNwZWNpYWxpemF0aW9uczogc3BlY2lhbGl6YXRpb25zIHx8IFtdLFxyXG4gICAgICAgIGxhbmd1YWdlczogbGFuZ3VhZ2VzIHx8IFtdLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0UHJvZmlsZSh1c2VySWQpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVXNlcih1c2VySWQ6IHN0cmluZykge1xyXG4gIC8vIERlbGV0ZSBmcm9tIFByaXNtYSAoYXBwbGljYXRpb24gZGF0YSlcclxuICAvLyBXZSB1c2UgYSB0cmFuc2FjdGlvbiBvciBqdXN0IGRlbGV0ZS4gRGVsZXRpbmcgcHJvZmlsZSB1c3VhbGx5IGNhc2NhZGVzIHRvIHJlbGF0ZWQgdGFibGVzIGluIFByaXNtYSBzY2hlbWFcclxuICAvLyBCdXQgbGV0J3MganVzdCBkZWxldGUgdGhlIHByb2ZpbGUuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHByaXNtYS5wcm9maWxlcy5kZWxldGUoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgLy8gSWYgcmVjb3JkIGRvZXNuJ3QgZXhpc3QsIHdlIGNhbiBwcm9jZWVkIHRvIGRlbGV0ZSBmcm9tIEF1dGhcclxuICAgIGNvbnNvbGUud2FybihgRmFpbGVkIHRvIGRlbGV0ZSBwcm9maWxlIGZvciB1c2VyICR7dXNlcklkfTpgLCBlcnJvcik7XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBTdXBhYmFzZSBBdXRoXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pbi5hdXRoLmFkbWluLmRlbGV0ZVVzZXIodXNlcklkKTtcclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRlbGV0ZSB1c2VyIGZyb20gU3VwYWJhc2UgQXV0aDogJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG59XHJcbiJdfQ==