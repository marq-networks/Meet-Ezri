"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSessions = getSessions;
exports.endSession = endSession;
exports.getSessionById = getSessionById;
exports.createMessage = createMessage;
exports.getSessionTranscript = getSessionTranscript;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createSession(userId, input) {
    try {
        // Ensure user profile exists to satisfy foreign key constraint
        const profile = await prisma_1.default.profiles.findUnique({
            where: { id: userId },
            select: { id: true }
        });
        if (!profile) {
            throw new Error('User profile not found. Please complete onboarding first.');
        }
        const result = await prisma_1.default.app_sessions.create({
            data: {
                user_id: userId,
                type: input.type,
                title: input.title || (input.type === 'instant' ? 'Instant Session' : 'Scheduled Session'),
                duration_minutes: input.duration_minutes,
                scheduled_at: input.scheduled_at,
                config: input.config, // Prisma Json type workaround
                status: input.type === 'instant' ? 'active' : 'scheduled',
                // For instant sessions, we assume they start immediately
                started_at: input.type === 'instant' ? new Date() : undefined,
            },
        });
        return result;
    }
    catch (error) {
        console.error('Error in createSession service:', error);
        throw error;
    }
}
async function getSessions(userId, status) {
    return prisma_1.default.app_sessions.findMany({
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
async function endSession(userId, sessionId, durationSeconds) {
    const session = await getSessionById(userId, sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    // Deduct credits if duration is provided
    if (durationSeconds) {
        const minutesUsed = Math.ceil(durationSeconds / 60);
        // Update user credits
        try {
            await prisma_1.default.profiles.update({
                where: { id: userId },
                data: {
                    credits: {
                        decrement: minutesUsed
                    }
                }
            });
        }
        catch (error) {
            console.error('Failed to deduct credits:', error);
            // Continue to end session even if credit deduction fails
        }
    }
    return prisma_1.default.app_sessions.update({
        where: { id: sessionId },
        data: {
            status: 'completed',
            ended_at: new Date(),
            // If durationSeconds is provided, update duration_minutes (rounded up)
            ...(durationSeconds !== undefined ? { duration_minutes: Math.ceil(durationSeconds / 60) } : {}),
        },
    });
}
async function getSessionById(userId, sessionId) {
    return prisma_1.default.app_sessions.findFirst({
        where: {
            id: sessionId,
            user_id: userId,
        },
    });
}
async function createMessage(userId, sessionId, input) {
    const session = await getSessionById(userId, sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    return prisma_1.default.session_messages.create({
        data: {
            session_id: sessionId,
            role: input.role,
            content: input.content,
        },
    });
}
async function getSessionTranscript(userId, sessionId) {
    const session = await getSessionById(userId, sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    return prisma_1.default.session_messages.findMany({
        where: { session_id: sessionId },
        orderBy: { created_at: 'asc' },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9zZXNzaW9ucy9zZXNzaW9ucy5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3Nlc3Npb25zL3Nlc3Npb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxzQ0E4QkM7QUFFRCxrQ0FlQztBQUVELGdDQW1DQztBQUVELHdDQU9DO0FBRUQsc0NBYUM7QUFFRCxvREFVQztBQTNIRCw4REFBc0M7QUFHL0IsS0FBSyxVQUFVLGFBQWEsQ0FBQyxNQUFjLEVBQUUsS0FBeUI7SUFDM0UsSUFBSSxDQUFDO1FBQ0gsK0RBQStEO1FBQy9ELE1BQU0sT0FBTyxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQy9DLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7WUFDckIsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQzlDLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsTUFBTTtnQkFDZixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDMUYsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtnQkFDeEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO2dCQUNoQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQWEsRUFBRSw4QkFBOEI7Z0JBQzNELE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUN6RCx5REFBeUQ7Z0JBQ3pELFVBQVUsRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUM5RDtTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxNQUFjLEVBQUUsTUFBZTtJQUMvRCxPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUM5QjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7YUFDbkM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVksRUFBRSxNQUFNLEVBQUUsZ0RBQWdEO1NBQ3ZFO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxVQUFVLENBQUMsTUFBYyxFQUFFLFNBQWlCLEVBQUUsZUFBd0I7SUFDMUYsTUFBTSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLElBQUksZUFBZSxFQUFFLENBQUM7UUFDcEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFcEQsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQztZQUNILE1BQU0sZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFO3dCQUNQLFNBQVMsRUFBRSxXQUFXO3FCQUN2QjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRCx5REFBeUQ7UUFDM0QsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFO1FBQ3hCLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxXQUFXO1lBQ25CLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRTtZQUNwQix1RUFBdUU7WUFDdkUsR0FBRyxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ2hHO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxjQUFjLENBQUMsTUFBYyxFQUFFLFNBQWlCO0lBQ3BFLE9BQU8sZ0JBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO1FBQ25DLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxTQUFTO1lBQ2IsT0FBTyxFQUFFLE1BQU07U0FDaEI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FBQyxNQUFjLEVBQUUsU0FBaUIsRUFBRSxLQUF5QjtJQUM5RixNQUFNLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksRUFBRTtZQUNKLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDdkI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLG9CQUFvQixDQUFDLE1BQWMsRUFBRSxTQUFpQjtJQUMxRSxNQUFNLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1FBQ3RDLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7UUFDaEMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtLQUMvQixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByaXNtYSBmcm9tICcuLi8uLi9saWIvcHJpc21hJztcclxuaW1wb3J0IHsgQ3JlYXRlU2Vzc2lvbklucHV0LCBDcmVhdGVNZXNzYWdlSW5wdXQgfSBmcm9tICcuL3Nlc3Npb25zLnNjaGVtYSc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbih1c2VySWQ6IHN0cmluZywgaW5wdXQ6IENyZWF0ZVNlc3Npb25JbnB1dCkge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBFbnN1cmUgdXNlciBwcm9maWxlIGV4aXN0cyB0byBzYXRpc2Z5IGZvcmVpZ24ga2V5IGNvbnN0cmFpbnRcclxuICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZXMuZmluZFVuaXF1ZSh7XHJcbiAgICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgICAgc2VsZWN0OiB7IGlkOiB0cnVlIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghcHJvZmlsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzZXIgcHJvZmlsZSBub3QgZm91bmQuIFBsZWFzZSBjb21wbGV0ZSBvbmJvYXJkaW5nIGZpcnN0LicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByaXNtYS5hcHBfc2Vzc2lvbnMuY3JlYXRlKHtcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcclxuICAgICAgICB0eXBlOiBpbnB1dC50eXBlLFxyXG4gICAgICAgIHRpdGxlOiBpbnB1dC50aXRsZSB8fCAoaW5wdXQudHlwZSA9PT0gJ2luc3RhbnQnID8gJ0luc3RhbnQgU2Vzc2lvbicgOiAnU2NoZWR1bGVkIFNlc3Npb24nKSxcclxuICAgICAgICBkdXJhdGlvbl9taW51dGVzOiBpbnB1dC5kdXJhdGlvbl9taW51dGVzLFxyXG4gICAgICAgIHNjaGVkdWxlZF9hdDogaW5wdXQuc2NoZWR1bGVkX2F0LFxyXG4gICAgICAgIGNvbmZpZzogaW5wdXQuY29uZmlnIGFzIGFueSwgLy8gUHJpc21hIEpzb24gdHlwZSB3b3JrYXJvdW5kXHJcbiAgICAgICAgc3RhdHVzOiBpbnB1dC50eXBlID09PSAnaW5zdGFudCcgPyAnYWN0aXZlJyA6ICdzY2hlZHVsZWQnLFxyXG4gICAgICAgIC8vIEZvciBpbnN0YW50IHNlc3Npb25zLCB3ZSBhc3N1bWUgdGhleSBzdGFydCBpbW1lZGlhdGVseVxyXG4gICAgICAgIHN0YXJ0ZWRfYXQ6IGlucHV0LnR5cGUgPT09ICdpbnN0YW50JyA/IG5ldyBEYXRlKCkgOiB1bmRlZmluZWQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGNyZWF0ZVNlc3Npb24gc2VydmljZTonLCBlcnJvcik7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXNzaW9ucyh1c2VySWQ6IHN0cmluZywgc3RhdHVzPzogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHByaXNtYS5hcHBfc2Vzc2lvbnMuZmluZE1hbnkoe1xyXG4gICAgd2hlcmU6IHtcclxuICAgICAgdXNlcl9pZDogdXNlcklkLFxyXG4gICAgICAuLi4oc3RhdHVzID8geyBzdGF0dXMgfSA6IHt9KSxcclxuICAgIH0sXHJcbiAgICBpbmNsdWRlOiB7XHJcbiAgICAgIF9jb3VudDoge1xyXG4gICAgICAgIHNlbGVjdDogeyBzZXNzaW9uX21lc3NhZ2VzOiB0cnVlIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9yZGVyQnk6IHtcclxuICAgICAgc2NoZWR1bGVkX2F0OiAnZGVzYycsIC8vIENoYW5nZWQgdG8gZGVzYyB0byBzaG93IHJlY2VudCBzZXNzaW9ucyBmaXJzdFxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuZFNlc3Npb24odXNlcklkOiBzdHJpbmcsIHNlc3Npb25JZDogc3RyaW5nLCBkdXJhdGlvblNlY29uZHM/OiBudW1iZXIpIHtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbkJ5SWQodXNlcklkLCBzZXNzaW9uSWQpO1xyXG4gIGlmICghc2Vzc2lvbikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdTZXNzaW9uIG5vdCBmb3VuZCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGVkdWN0IGNyZWRpdHMgaWYgZHVyYXRpb24gaXMgcHJvdmlkZWRcclxuICBpZiAoZHVyYXRpb25TZWNvbmRzKSB7XHJcbiAgICBjb25zdCBtaW51dGVzVXNlZCA9IE1hdGguY2VpbChkdXJhdGlvblNlY29uZHMgLyA2MCk7XHJcbiAgICBcclxuICAgIC8vIFVwZGF0ZSB1c2VyIGNyZWRpdHNcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHByaXNtYS5wcm9maWxlcy51cGRhdGUoe1xyXG4gICAgICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBjcmVkaXRzOiB7XHJcbiAgICAgICAgICAgIGRlY3JlbWVudDogbWludXRlc1VzZWRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlZHVjdCBjcmVkaXRzOicsIGVycm9yKTtcclxuICAgICAgLy8gQ29udGludWUgdG8gZW5kIHNlc3Npb24gZXZlbiBpZiBjcmVkaXQgZGVkdWN0aW9uIGZhaWxzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJpc21hLmFwcF9zZXNzaW9ucy51cGRhdGUoe1xyXG4gICAgd2hlcmU6IHsgaWQ6IHNlc3Npb25JZCB9LFxyXG4gICAgZGF0YToge1xyXG4gICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxyXG4gICAgICBlbmRlZF9hdDogbmV3IERhdGUoKSxcclxuICAgICAgLy8gSWYgZHVyYXRpb25TZWNvbmRzIGlzIHByb3ZpZGVkLCB1cGRhdGUgZHVyYXRpb25fbWludXRlcyAocm91bmRlZCB1cClcclxuICAgICAgLi4uKGR1cmF0aW9uU2Vjb25kcyAhPT0gdW5kZWZpbmVkID8geyBkdXJhdGlvbl9taW51dGVzOiBNYXRoLmNlaWwoZHVyYXRpb25TZWNvbmRzIC8gNjApIH0gOiB7fSksXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbkJ5SWQodXNlcklkOiBzdHJpbmcsIHNlc3Npb25JZDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHByaXNtYS5hcHBfc2Vzc2lvbnMuZmluZEZpcnN0KHtcclxuICAgIHdoZXJlOiB7XHJcbiAgICAgIGlkOiBzZXNzaW9uSWQsXHJcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlKHVzZXJJZDogc3RyaW5nLCBzZXNzaW9uSWQ6IHN0cmluZywgaW5wdXQ6IENyZWF0ZU1lc3NhZ2VJbnB1dCkge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uQnlJZCh1c2VySWQsIHNlc3Npb25JZCk7XHJcbiAgaWYgKCFzZXNzaW9uKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Nlc3Npb24gbm90IGZvdW5kJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJpc21hLnNlc3Npb25fbWVzc2FnZXMuY3JlYXRlKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgc2Vzc2lvbl9pZDogc2Vzc2lvbklkLFxyXG4gICAgICByb2xlOiBpbnB1dC5yb2xlLFxyXG4gICAgICBjb250ZW50OiBpbnB1dC5jb250ZW50LFxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb25UcmFuc2NyaXB0KHVzZXJJZDogc3RyaW5nLCBzZXNzaW9uSWQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uQnlJZCh1c2VySWQsIHNlc3Npb25JZCk7XHJcbiAgaWYgKCFzZXNzaW9uKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Nlc3Npb24gbm90IGZvdW5kJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJpc21hLnNlc3Npb25fbWVzc2FnZXMuZmluZE1hbnkoe1xyXG4gICAgd2hlcmU6IHsgc2Vzc2lvbl9pZDogc2Vzc2lvbklkIH0sXHJcbiAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6ICdhc2MnIH0sXHJcbiAgfSk7XHJcbn1cclxuIl19