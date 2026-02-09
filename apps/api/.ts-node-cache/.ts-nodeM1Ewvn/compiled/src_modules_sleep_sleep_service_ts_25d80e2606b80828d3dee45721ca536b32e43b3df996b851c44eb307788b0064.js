"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSleepEntry = createSleepEntry;
exports.getSleepEntries = getSleepEntries;
exports.getSleepEntryById = getSleepEntryById;
exports.updateSleepEntry = updateSleepEntry;
exports.deleteSleepEntry = deleteSleepEntry;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createSleepEntry(userId, data) {
    return prisma_1.default.sleep_entries.create({
        data: {
            user_id: userId,
            ...data,
        },
    });
}
async function getSleepEntries(userId) {
    return prisma_1.default.sleep_entries.findMany({
        where: { user_id: userId },
        orderBy: { bed_time: 'desc' },
    });
}
async function getSleepEntryById(userId, id) {
    return prisma_1.default.sleep_entries.findUnique({
        where: { id },
    });
}
async function updateSleepEntry(userId, id, data) {
    // Ensure user owns the entry
    const entry = await prisma_1.default.sleep_entries.findUnique({ where: { id } });
    if (!entry || entry.user_id !== userId) {
        throw new Error('Sleep entry not found or unauthorized');
    }
    return prisma_1.default.sleep_entries.update({
        where: { id },
        data,
    });
}
async function deleteSleepEntry(userId, id) {
    // Ensure user owns the entry
    const entry = await prisma_1.default.sleep_entries.findUnique({ where: { id } });
    if (!entry || entry.user_id !== userId) {
        throw new Error('Sleep entry not found or unauthorized');
    }
    return prisma_1.default.sleep_entries.delete({
        where: { id },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9zbGVlcC9zbGVlcC5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3NsZWVwL3NsZWVwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSw0Q0FPQztBQUVELDBDQUtDO0FBRUQsOENBSUM7QUFFRCw0Q0FXQztBQUVELDRDQVVDO0FBaERELDhEQUFzQztBQUcvQixLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLElBQTJCO0lBQ2hGLE9BQU8sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxNQUFNO1lBQ2YsR0FBRyxJQUFJO1NBQ1I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGVBQWUsQ0FBQyxNQUFjO0lBQ2xELE9BQU8sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ25DLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7UUFDMUIsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtLQUM5QixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxFQUFVO0lBQ2hFLE9BQU8sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBQ3JDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLEVBQVUsRUFBRSxJQUEyQjtJQUM1Riw2QkFBNkI7SUFDN0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkUsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsT0FBTyxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDakMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2IsSUFBSTtLQUNMLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLEVBQVU7SUFDL0QsNkJBQTZCO0lBQzdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUUsQ0FBQztRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE9BQU8sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ2pDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJpc21hIGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgQ3JlYXRlU2xlZXBFbnRyeUlucHV0LCBVcGRhdGVTbGVlcEVudHJ5SW5wdXQgfSBmcm9tICcuL3NsZWVwLnNjaGVtYSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTbGVlcEVudHJ5KHVzZXJJZDogc3RyaW5nLCBkYXRhOiBDcmVhdGVTbGVlcEVudHJ5SW5wdXQpIHtcbiAgcmV0dXJuIHByaXNtYS5zbGVlcF9lbnRyaWVzLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNsZWVwRW50cmllcyh1c2VySWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLnNsZWVwX2VudHJpZXMuZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHVzZXJfaWQ6IHVzZXJJZCB9LFxuICAgIG9yZGVyQnk6IHsgYmVkX3RpbWU6ICdkZXNjJyB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNsZWVwRW50cnlCeUlkKHVzZXJJZDogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gIHJldHVybiBwcmlzbWEuc2xlZXBfZW50cmllcy5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBpZCB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVNsZWVwRW50cnkodXNlcklkOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRhdGE6IFVwZGF0ZVNsZWVwRW50cnlJbnB1dCkge1xuICAvLyBFbnN1cmUgdXNlciBvd25zIHRoZSBlbnRyeVxuICBjb25zdCBlbnRyeSA9IGF3YWl0IHByaXNtYS5zbGVlcF9lbnRyaWVzLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZCB9IH0pO1xuICBpZiAoIWVudHJ5IHx8IGVudHJ5LnVzZXJfaWQgIT09IHVzZXJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU2xlZXAgZW50cnkgbm90IGZvdW5kIG9yIHVuYXV0aG9yaXplZCcpO1xuICB9XG5cbiAgcmV0dXJuIHByaXNtYS5zbGVlcF9lbnRyaWVzLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQgfSxcbiAgICBkYXRhLFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNsZWVwRW50cnkodXNlcklkOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgLy8gRW5zdXJlIHVzZXIgb3ducyB0aGUgZW50cnlcbiAgY29uc3QgZW50cnkgPSBhd2FpdCBwcmlzbWEuc2xlZXBfZW50cmllcy5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQgfSB9KTtcbiAgaWYgKCFlbnRyeSB8fCBlbnRyeS51c2VyX2lkICE9PSB1c2VySWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NsZWVwIGVudHJ5IG5vdCBmb3VuZCBvciB1bmF1dGhvcml6ZWQnKTtcbiAgfVxuXG4gIHJldHVybiBwcmlzbWEuc2xlZXBfZW50cmllcy5kZWxldGUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuIl19