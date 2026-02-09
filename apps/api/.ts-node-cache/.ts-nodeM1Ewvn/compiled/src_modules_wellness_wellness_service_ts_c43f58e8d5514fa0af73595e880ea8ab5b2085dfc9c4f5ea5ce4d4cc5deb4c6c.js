"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWellnessTool = createWellnessTool;
exports.getWellnessTools = getWellnessTools;
exports.getWellnessToolById = getWellnessToolById;
exports.updateWellnessTool = updateWellnessTool;
exports.deleteWellnessTool = deleteWellnessTool;
exports.trackWellnessProgress = trackWellnessProgress;
const prisma_1 = require("../../lib/prisma");
async function createWellnessTool(data) {
    return prisma_1.prisma.wellness_tools.create({
        data,
    });
}
async function getWellnessTools(category) {
    const where = category ? { category } : {};
    return prisma_1.prisma.wellness_tools.findMany({
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
    return prisma_1.prisma.wellness_tools.findUnique({
        where: { id },
    });
}
async function updateWellnessTool(id, data) {
    return prisma_1.prisma.wellness_tools.update({
        where: { id },
        data: {
            ...data,
            updated_at: new Date(),
        },
    });
}
async function deleteWellnessTool(id) {
    return prisma_1.prisma.wellness_tools.delete({
        where: { id },
    });
}
async function trackWellnessProgress(userId, toolId, durationSpent, rating) {
    return prisma_1.prisma.user_wellness_progress.create({
        data: {
            user_id: userId,
            tool_id: toolId,
            duration_spent: durationSpent,
            feedback_rating: rating,
            completed_at: new Date(),
        },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy93ZWxsbmVzcy93ZWxsbmVzcy5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3dlbGxuZXNzL3dlbGxuZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxnREFJQztBQUVELDRDQWFDO0FBRUQsa0RBSUM7QUFFRCxnREFRQztBQUVELGdEQUlDO0FBRUQsc0RBVUM7QUF4REQsNkNBQTBDO0FBR25DLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxJQUF1RDtJQUM5RixPQUFPLGVBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQ2xDLElBQUk7S0FDTCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGdCQUFnQixDQUFDLFFBQWlCO0lBQ3RELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNDLE9BQU8sZUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDcEMsS0FBSztRQUNMLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7UUFDL0IsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRTtvQkFDTixTQUFTLEVBQUUsSUFBSTtpQkFDaEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxFQUFVO0lBQ2xELE9BQU8sZUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO0tBQ2QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFVLEVBQUUsSUFBNkI7SUFDaEYsT0FBTyxlQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDYixJQUFJLEVBQUU7WUFDSixHQUFHLElBQUk7WUFDUCxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUU7U0FDdkI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGtCQUFrQixDQUFDLEVBQVU7SUFDakQsT0FBTyxlQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7S0FDZCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLHFCQUFxQixDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsYUFBcUIsRUFBRSxNQUFlO0lBQ2hILE9BQU8sZUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsTUFBTTtZQUNmLE9BQU8sRUFBRSxNQUFNO1lBQ2YsY0FBYyxFQUFFLGFBQWE7WUFDN0IsZUFBZSxFQUFFLE1BQU07WUFDdkIsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3pCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgQ3JlYXRlV2VsbG5lc3NUb29sSW5wdXQsIFVwZGF0ZVdlbGxuZXNzVG9vbElucHV0IH0gZnJvbSAnLi93ZWxsbmVzcy5zY2hlbWEnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2VsbG5lc3NUb29sKGRhdGE6IENyZWF0ZVdlbGxuZXNzVG9vbElucHV0ICYgeyBjcmVhdGVkX2J5Pzogc3RyaW5nIH0pIHtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy5jcmVhdGUoe1xuICAgIGRhdGEsXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0V2VsbG5lc3NUb29scyhjYXRlZ29yeT86IHN0cmluZykge1xuICBjb25zdCB3aGVyZSA9IGNhdGVnb3J5ID8geyBjYXRlZ29yeSB9IDoge307XG4gIHJldHVybiBwcmlzbWEud2VsbG5lc3NfdG9vbHMuZmluZE1hbnkoe1xuICAgIHdoZXJlLFxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgcHJvZmlsZXM6IHtcbiAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgZnVsbF9uYW1lOiB0cnVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFdlbGxuZXNzVG9vbEJ5SWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLndlbGxuZXNzX3Rvb2xzLmZpbmRVbmlxdWUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlV2VsbG5lc3NUb29sKGlkOiBzdHJpbmcsIGRhdGE6IFVwZGF0ZVdlbGxuZXNzVG9vbElucHV0KSB7XG4gIHJldHVybiBwcmlzbWEud2VsbG5lc3NfdG9vbHMudXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZCB9LFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlV2VsbG5lc3NUb29sKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy5kZWxldGUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJhY2tXZWxsbmVzc1Byb2dyZXNzKHVzZXJJZDogc3RyaW5nLCB0b29sSWQ6IHN0cmluZywgZHVyYXRpb25TcGVudDogbnVtYmVyLCByYXRpbmc/OiBudW1iZXIpIHtcbiAgcmV0dXJuIHByaXNtYS51c2VyX3dlbGxuZXNzX3Byb2dyZXNzLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgdG9vbF9pZDogdG9vbElkLFxuICAgICAgZHVyYXRpb25fc3BlbnQ6IGR1cmF0aW9uU3BlbnQsXG4gICAgICBmZWVkYmFja19yYXRpbmc6IHJhdGluZyxcbiAgICAgIGNvbXBsZXRlZF9hdDogbmV3IERhdGUoKSxcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==