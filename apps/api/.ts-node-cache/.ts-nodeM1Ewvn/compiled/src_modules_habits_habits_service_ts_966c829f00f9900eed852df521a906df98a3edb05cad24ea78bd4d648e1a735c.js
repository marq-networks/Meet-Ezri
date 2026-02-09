"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHabit = createHabit;
exports.getHabits = getHabits;
exports.updateHabit = updateHabit;
exports.deleteHabit = deleteHabit;
exports.logHabitCompletion = logHabitCompletion;
exports.removeHabitCompletion = removeHabitCompletion;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createHabit(userId, data) {
    return prisma_1.default.habits.create({
        data: {
            user_id: userId,
            ...data,
        },
    });
}
async function getHabits(userId) {
    return prisma_1.default.habits.findMany({
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
async function updateHabit(userId, habitId, data) {
    // Verify ownership
    const habit = await prisma_1.default.habits.findFirst({
        where: { id: habitId, user_id: userId },
    });
    if (!habit) {
        throw new Error("Habit not found or unauthorized");
    }
    return prisma_1.default.habits.update({
        where: { id: habitId },
        data,
    });
}
async function deleteHabit(userId, habitId) {
    // Verify ownership
    const habit = await prisma_1.default.habits.findFirst({
        where: { id: habitId, user_id: userId },
    });
    if (!habit) {
        throw new Error("Habit not found or unauthorized");
    }
    // Instead of hard delete, we might want to archive, but the requirement implies deletion capability.
    // The schema supports hard delete (cascade), so we can just delete.
    return prisma_1.default.habits.delete({
        where: { id: habitId },
    });
}
async function logHabitCompletion(userId, habitId, data) {
    // Verify ownership
    const habit = await prisma_1.default.habits.findFirst({
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
    return prisma_1.default.habit_logs.create({
        data: {
            habit_id: habitId,
            completed_at: completedAt,
        },
    });
}
async function removeHabitCompletion(userId, habitId, dateStr) {
    // Verify ownership via habit
    const habit = await prisma_1.default.habits.findFirst({
        where: { id: habitId, user_id: userId },
    });
    if (!habit) {
        throw new Error("Habit not found or unauthorized");
    }
    // Find logs on that date
    const date = new Date(dateStr);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const logs = await prisma_1.default.habit_logs.findMany({
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
        await prisma_1.default.habit_logs.deleteMany({
            where: {
                id: {
                    in: logs.map(l => l.id),
                },
            },
        });
        return { success: true, count: logs.length };
    }
    return { success: false, message: "No logs found for this date" };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9oYWJpdHMvaGFiaXRzLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvaGFiaXRzL2hhYml0cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0Esa0NBT0M7QUFFRCw4QkFrQkM7QUFFRCxrQ0FjQztBQUVELGtDQWVDO0FBRUQsZ0RBeUJDO0FBRUQsc0RBc0NDO0FBbElELDhEQUFzQztBQUcvQixLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQWMsRUFBRSxJQUFzQjtJQUN0RSxPQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsTUFBTTtZQUNmLEdBQUcsSUFBSTtTQUNSO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxTQUFTLENBQUMsTUFBYztJQUM1QyxPQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM1QixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxLQUFLO1NBQ25CO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRTtvQkFDUCxZQUFZLEVBQUUsTUFBTTtpQkFDckI7Z0JBQ0QsSUFBSSxFQUFFLEdBQUcsRUFBRSxtQ0FBbUM7YUFDL0M7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLFVBQVUsRUFBRSxLQUFLO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFzQjtJQUN2RixtQkFBbUI7SUFDbkIsTUFBTSxLQUFLLEdBQUcsTUFBTSxn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LEdBQUcsTUFBTSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDNUMsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLE9BQU87WUFDakIsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSxJQUFJO2dCQUNULEVBQUUsRUFBRSxPQUFPO2FBQ1o7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQix1REFBdUQ7UUFDdkQsTUFBTSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDakMsS0FBSyxFQUFFO2dCQUNMLEVBQUUsRUFBRTtvQkFDRixFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ3hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztBQUNwRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByaXNtYSBmcm9tIFwiLi4vLi4vbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgQ3JlYXRlSGFiaXRJbnB1dCwgVXBkYXRlSGFiaXRJbnB1dCwgTG9nSGFiaXRJbnB1dCB9IGZyb20gXCIuL2hhYml0cy5zY2hlbWFcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUhhYml0KHVzZXJJZDogc3RyaW5nLCBkYXRhOiBDcmVhdGVIYWJpdElucHV0KSB7XG4gIHJldHVybiBwcmlzbWEuaGFiaXRzLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEhhYml0cyh1c2VySWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLmhhYml0cy5maW5kTWFueSh7XG4gICAgd2hlcmU6IHtcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICAgIGlzX2FyY2hpdmVkOiBmYWxzZSxcbiAgICB9LFxuICAgIGluY2x1ZGU6IHtcbiAgICAgIGhhYml0X2xvZ3M6IHtcbiAgICAgICAgb3JkZXJCeToge1xuICAgICAgICAgIGNvbXBsZXRlZF9hdDogJ2Rlc2MnLFxuICAgICAgICB9LFxuICAgICAgICB0YWtlOiAzNjUsIC8vIEZldGNoIGVub3VnaCBoaXN0b3J5IGZvciBzdHJlYWtzXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3JkZXJCeToge1xuICAgICAgY3JlYXRlZF9hdDogJ2FzYycsXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVIYWJpdCh1c2VySWQ6IHN0cmluZywgaGFiaXRJZDogc3RyaW5nLCBkYXRhOiBVcGRhdGVIYWJpdElucHV0KSB7XG4gIC8vIFZlcmlmeSBvd25lcnNoaXBcbiAgY29uc3QgaGFiaXQgPSBhd2FpdCBwcmlzbWEuaGFiaXRzLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGhhYml0SWQsIHVzZXJfaWQ6IHVzZXJJZCB9LFxuICB9KTtcblxuICBpZiAoIWhhYml0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSGFiaXQgbm90IGZvdW5kIG9yIHVuYXV0aG9yaXplZFwiKTtcbiAgfVxuXG4gIHJldHVybiBwcmlzbWEuaGFiaXRzLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IGhhYml0SWQgfSxcbiAgICBkYXRhLFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUhhYml0KHVzZXJJZDogc3RyaW5nLCBoYWJpdElkOiBzdHJpbmcpIHtcbiAgLy8gVmVyaWZ5IG93bmVyc2hpcFxuICBjb25zdCBoYWJpdCA9IGF3YWl0IHByaXNtYS5oYWJpdHMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogaGFiaXRJZCwgdXNlcl9pZDogdXNlcklkIH0sXG4gIH0pO1xuXG4gIGlmICghaGFiaXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJIYWJpdCBub3QgZm91bmQgb3IgdW5hdXRob3JpemVkXCIpO1xuICB9XG5cbiAgLy8gSW5zdGVhZCBvZiBoYXJkIGRlbGV0ZSwgd2UgbWlnaHQgd2FudCB0byBhcmNoaXZlLCBidXQgdGhlIHJlcXVpcmVtZW50IGltcGxpZXMgZGVsZXRpb24gY2FwYWJpbGl0eS5cbiAgLy8gVGhlIHNjaGVtYSBzdXBwb3J0cyBoYXJkIGRlbGV0ZSAoY2FzY2FkZSksIHNvIHdlIGNhbiBqdXN0IGRlbGV0ZS5cbiAgcmV0dXJuIHByaXNtYS5oYWJpdHMuZGVsZXRlKHtcbiAgICB3aGVyZTogeyBpZDogaGFiaXRJZCB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ0hhYml0Q29tcGxldGlvbih1c2VySWQ6IHN0cmluZywgaGFiaXRJZDogc3RyaW5nLCBkYXRhOiBMb2dIYWJpdElucHV0KSB7XG4gIC8vIFZlcmlmeSBvd25lcnNoaXBcbiAgY29uc3QgaGFiaXQgPSBhd2FpdCBwcmlzbWEuaGFiaXRzLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGhhYml0SWQsIHVzZXJfaWQ6IHVzZXJJZCB9LFxuICB9KTtcblxuICBpZiAoIWhhYml0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSGFiaXQgbm90IGZvdW5kIG9yIHVuYXV0aG9yaXplZFwiKTtcbiAgfVxuXG4gIGNvbnN0IGNvbXBsZXRlZEF0ID0gZGF0YS5jb21wbGV0ZWRfYXQgPyBuZXcgRGF0ZShkYXRhLmNvbXBsZXRlZF9hdCkgOiBuZXcgRGF0ZSgpO1xuXG4gIC8vIENoZWNrIGlmIGFscmVhZHkgbG9nZ2VkIGZvciB0aGlzIGRheSAoaWYgZnJlcXVlbmN5IGlzIGRhaWx5KVxuICAvLyBPciBqdXN0IGNyZWF0ZSBhIG5ldyBsb2cuIFRoZSBmcm9udGVuZCByZXF1aXJlbWVudCBpbXBsaWVzIHRvZ2dsaW5nLlxuICAvLyBJZiB3ZSB3YW50IHRvIHRvZ2dsZSwgd2Ugc2hvdWxkIGNoZWNrIGlmIGEgbG9nIGV4aXN0cyBmb3IgdG9kYXkuXG4gIC8vIEJ1dCB0aGUgc2VydmljZSBqdXN0IFwibG9nc1wiIGl0LiBXZSBjYW4gaGF2ZSBhIHNlcGFyYXRlIFwidW5sb2dcIiBvciBcInRvZ2dsZVwiIGVuZHBvaW50LFxuICAvLyBvciBoYW5kbGUgaXQgaW4gdGhlIGNvbnRyb2xsZXIuXG4gIC8vIEZvciBzaW1wbGljaXR5LCBsZXQncyBjcmVhdGUgYSBsb2cuIElmIHRoZSB1c2VyIHdhbnRzIHRvIFwidW5jb21wbGV0ZVwiLCB0aGV5IGRlbGV0ZSB0aGUgbG9nLlxuICBcbiAgcmV0dXJuIHByaXNtYS5oYWJpdF9sb2dzLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgaGFiaXRfaWQ6IGhhYml0SWQsXG4gICAgICBjb21wbGV0ZWRfYXQ6IGNvbXBsZXRlZEF0LFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlSGFiaXRDb21wbGV0aW9uKHVzZXJJZDogc3RyaW5nLCBoYWJpdElkOiBzdHJpbmcsIGRhdGVTdHI6IHN0cmluZykge1xuICAvLyBWZXJpZnkgb3duZXJzaGlwIHZpYSBoYWJpdFxuICBjb25zdCBoYWJpdCA9IGF3YWl0IHByaXNtYS5oYWJpdHMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogaGFiaXRJZCwgdXNlcl9pZDogdXNlcklkIH0sXG4gIH0pO1xuXG4gIGlmICghaGFiaXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJIYWJpdCBub3QgZm91bmQgb3IgdW5hdXRob3JpemVkXCIpO1xuICB9XG5cbiAgLy8gRmluZCBsb2dzIG9uIHRoYXQgZGF0ZVxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cik7XG4gIGNvbnN0IG5leHREYXkgPSBuZXcgRGF0ZShkYXRlKTtcbiAgbmV4dERheS5zZXREYXRlKG5leHREYXkuZ2V0RGF0ZSgpICsgMSk7XG5cbiAgY29uc3QgbG9ncyA9IGF3YWl0IHByaXNtYS5oYWJpdF9sb2dzLmZpbmRNYW55KHtcbiAgICB3aGVyZToge1xuICAgICAgaGFiaXRfaWQ6IGhhYml0SWQsXG4gICAgICBjb21wbGV0ZWRfYXQ6IHtcbiAgICAgICAgZ3RlOiBkYXRlLFxuICAgICAgICBsdDogbmV4dERheSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgaWYgKGxvZ3MubGVuZ3RoID4gMCkge1xuICAgIC8vIERlbGV0ZSBhbGwgbG9ncyBmb3IgdGhhdCBkYXkgKGluIGNhc2Ugb2YgZHVwbGljYXRlcylcbiAgICBhd2FpdCBwcmlzbWEuaGFiaXRfbG9ncy5kZWxldGVNYW55KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiB7XG4gICAgICAgICAgaW46IGxvZ3MubWFwKGwgPT4gbC5pZCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGNvdW50OiBsb2dzLmxlbmd0aCB9O1xuICB9XG5cbiAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiTm8gbG9ncyBmb3VuZCBmb3IgdGhpcyBkYXRlXCIgfTtcbn1cbiJdfQ==