"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWellnessTool = createWellnessTool;
exports.getWellnessTools = getWellnessTools;
exports.getWellnessToolById = getWellnessToolById;
exports.updateWellnessTool = updateWellnessTool;
exports.deleteWellnessTool = deleteWellnessTool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy93ZWxsbmVzcy93ZWxsbmVzcy5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3dlbGxuZXNzL3dlbGxuZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxnREFJQztBQUVELDRDQWFDO0FBRUQsa0RBSUM7QUFFRCxnREFRQztBQUVELGdEQUlDO0FBNUNELDZDQUEwQztBQUduQyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsSUFBdUQ7SUFDOUYsT0FBTyxlQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJO0tBQ0wsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxRQUFpQjtJQUN0RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzQyxPQUFPLGVBQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ3BDLEtBQUs7UUFDTCxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO1FBQy9CLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUU7b0JBQ04sU0FBUyxFQUFFLElBQUk7aUJBQ2hCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBVTtJQUNsRCxPQUFPLGVBQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO1FBQ3RDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFBVSxFQUFFLElBQTZCO0lBQ2hGLE9BQU8sZUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFDbEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxFQUFFO1lBQ0osR0FBRyxJQUFJO1lBQ1AsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3ZCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFVO0lBQ2pELE9BQU8sZUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFDbEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO0tBQ2QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgQ3JlYXRlV2VsbG5lc3NUb29sSW5wdXQsIFVwZGF0ZVdlbGxuZXNzVG9vbElucHV0IH0gZnJvbSAnLi93ZWxsbmVzcy5zY2hlbWEnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2VsbG5lc3NUb29sKGRhdGE6IENyZWF0ZVdlbGxuZXNzVG9vbElucHV0ICYgeyBjcmVhdGVkX2J5Pzogc3RyaW5nIH0pIHtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy5jcmVhdGUoe1xuICAgIGRhdGEsXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0V2VsbG5lc3NUb29scyhjYXRlZ29yeT86IHN0cmluZykge1xuICBjb25zdCB3aGVyZSA9IGNhdGVnb3J5ID8geyBjYXRlZ29yeSB9IDoge307XG4gIHJldHVybiBwcmlzbWEud2VsbG5lc3NfdG9vbHMuZmluZE1hbnkoe1xuICAgIHdoZXJlLFxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZF9hdDogJ2Rlc2MnIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgcHJvZmlsZXM6IHtcbiAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgZnVsbF9uYW1lOiB0cnVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFdlbGxuZXNzVG9vbEJ5SWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLndlbGxuZXNzX3Rvb2xzLmZpbmRVbmlxdWUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlV2VsbG5lc3NUb29sKGlkOiBzdHJpbmcsIGRhdGE6IFVwZGF0ZVdlbGxuZXNzVG9vbElucHV0KSB7XG4gIHJldHVybiBwcmlzbWEud2VsbG5lc3NfdG9vbHMudXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZCB9LFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlV2VsbG5lc3NUb29sKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHByaXNtYS53ZWxsbmVzc190b29scy5kZWxldGUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuIl19