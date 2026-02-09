"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWellnessTool = createWellnessTool;
exports.getWellnessTools = getWellnessTools;
exports.getWellnessToolById = getWellnessToolById;
exports.updateWellnessTool = updateWellnessTool;
exports.deleteWellnessTool = deleteWellnessTool;
exports.trackWellnessProgress = trackWellnessProgress;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createWellnessTool(data) {
    return prisma_1.default.wellness_tools.create({
        data,
    });
}
async function getWellnessTools(category) {
    const where = category ? { category } : {};
    return prisma_1.default.wellness_tools.findMany({
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
async function getWellnessToolById(id) {
    return prisma_1.default.wellness_tools.findUnique({
        where: { id },
    });
}
async function updateWellnessTool(id, data) {
    return prisma_1.default.wellness_tools.update({
        where: { id },
        data: {
            ...data,
            updated_at: new Date(),
        },
    });
}
async function deleteWellnessTool(id) {
    return prisma_1.default.wellness_tools.delete({
        where: { id },
    });
}
async function trackWellnessProgress(userId, toolId, durationSpent, rating) {
    return prisma_1.default.user_wellness_progress.create({
        data: {
            user_id: userId,
            tool_id: toolId,
            duration_spent: durationSpent,
            feedback_rating: rating,
            completed_at: new Date(),
        },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy93ZWxsbmVzcy93ZWxsbmVzcy5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3dlbGxuZXNzL3dlbGxuZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxnREFJQztBQUVELDRDQWFDO0FBRUQsa0RBSUM7QUFFRCxnREFRQztBQUVELGdEQUlDO0FBRUQsc0RBVUM7QUF4REQsOERBQXNDO0FBRy9CLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxJQUF1RDtJQUM5RixPQUFPLGdCQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJO0tBQ0wsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxRQUFpQjtJQUN0RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzQyxPQUFPLGdCQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNwQyxLQUFLO1FBQ0wsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtRQUMvQixPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFO29CQUNOLFNBQVMsRUFBRSxJQUFJO2lCQUNoQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLG1CQUFtQixDQUFDLEVBQVU7SUFDbEQsT0FBTyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO0tBQ2QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFVLEVBQUUsSUFBNkI7SUFDaEYsT0FBTyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFDbEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxFQUFFO1lBQ0osR0FBRyxJQUFJO1lBQ1AsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3ZCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFVO0lBQ2pELE9BQU8sZ0JBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQ2xDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUscUJBQXFCLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxhQUFxQixFQUFFLE1BQWU7SUFDaEgsT0FBTyxnQkFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsTUFBTTtZQUNmLE9BQU8sRUFBRSxNQUFNO1lBQ2YsY0FBYyxFQUFFLGFBQWE7WUFDN0IsZUFBZSxFQUFFLE1BQU07WUFDdkIsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3pCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwcmlzbWEgZnJvbSAnLi4vLi4vbGliL3ByaXNtYSc7XG5pbXBvcnQgeyBDcmVhdGVXZWxsbmVzc1Rvb2xJbnB1dCwgVXBkYXRlV2VsbG5lc3NUb29sSW5wdXQgfSBmcm9tICcuL3dlbGxuZXNzLnNjaGVtYSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVXZWxsbmVzc1Rvb2woZGF0YTogQ3JlYXRlV2VsbG5lc3NUb29sSW5wdXQgJiB7IGNyZWF0ZWRfYnk/OiBzdHJpbmcgfSkge1xuICByZXR1cm4gcHJpc21hLndlbGxuZXNzX3Rvb2xzLmNyZWF0ZSh7XG4gICAgZGF0YSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXZWxsbmVzc1Rvb2xzKGNhdGVnb3J5Pzogc3RyaW5nKSB7XG4gIGNvbnN0IHdoZXJlID0gY2F0ZWdvcnkgPyB7IGNhdGVnb3J5IH0gOiB7fTtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy5maW5kTWFueSh7XG4gICAgd2hlcmUsXG4gICAgb3JkZXJCeTogeyBjcmVhdGVkX2F0OiAnZGVzYycgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBwcm9maWxlczoge1xuICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICBmdWxsX25hbWU6IHRydWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0V2VsbG5lc3NUb29sQnlJZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBwcmlzbWEud2VsbG5lc3NfdG9vbHMuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgaWQgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVXZWxsbmVzc1Rvb2woaWQ6IHN0cmluZywgZGF0YTogVXBkYXRlV2VsbG5lc3NUb29sSW5wdXQpIHtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy51cGRhdGUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCksXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVXZWxsbmVzc1Rvb2woaWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLndlbGxuZXNzX3Rvb2xzLmRlbGV0ZSh7XG4gICAgd2hlcmU6IHsgaWQgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cmFja1dlbGxuZXNzUHJvZ3Jlc3ModXNlcklkOiBzdHJpbmcsIHRvb2xJZDogc3RyaW5nLCBkdXJhdGlvblNwZW50OiBudW1iZXIsIHJhdGluZz86IG51bWJlcikge1xuICByZXR1cm4gcHJpc21hLnVzZXJfd2VsbG5lc3NfcHJvZ3Jlc3MuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICB1c2VyX2lkOiB1c2VySWQsXG4gICAgICB0b29sX2lkOiB0b29sSWQsXG4gICAgICBkdXJhdGlvbl9zcGVudDogZHVyYXRpb25TcGVudCxcbiAgICAgIGZlZWRiYWNrX3JhdGluZzogcmF0aW5nLFxuICAgICAgY29tcGxldGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIH0sXG4gIH0pO1xufVxuIl19