"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournalEntry = createJournalEntry;
exports.getJournalEntries = getJournalEntries;
exports.getJournalEntryById = getJournalEntryById;
exports.updateJournalEntry = updateJournalEntry;
exports.deleteJournalEntry = deleteJournalEntry;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createJournalEntry(userId, data) {
    return prisma_1.default.journal_entries.create({
        data: {
            user_id: userId,
            ...data,
        },
    });
}
async function getJournalEntries(userId) {
    return prisma_1.default.journal_entries.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}
async function getJournalEntryById(userId, id) {
    return prisma_1.default.journal_entries.findFirst({
        where: {
            id,
            user_id: userId,
        },
    });
}
async function updateJournalEntry(userId, id, data) {
    const existing = await prisma_1.default.journal_entries.findFirst({
        where: { id, user_id: userId },
    });
    if (!existing) {
        throw new Error('Journal entry not found');
    }
    return prisma_1.default.journal_entries.update({
        where: { id },
        data: {
            ...data,
            updated_at: new Date(),
        },
    });
}
async function deleteJournalEntry(userId, id) {
    const existing = await prisma_1.default.journal_entries.findFirst({
        where: { id, user_id: userId },
    });
    if (!existing) {
        throw new Error('Journal entry not found');
    }
    return prisma_1.default.journal_entries.delete({
        where: { id },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9qb3VybmFsL2pvdXJuYWwuc2VydmljZS50cyIsInNvdXJjZXMiOlsiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9qb3VybmFsL2pvdXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLGdEQU9DO0FBRUQsOENBU0M7QUFFRCxrREFPQztBQUVELGdEQWdCQztBQUVELGdEQVlDO0FBOURELDhEQUFzQztBQUcvQixLQUFLLFVBQVUsa0JBQWtCLENBQUMsTUFBYyxFQUFFLElBQXdCO0lBQy9FLE9BQU8sZ0JBQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1FBQ25DLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxNQUFNO1lBQ2YsR0FBRyxJQUFJO1NBQ1I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLE1BQWM7SUFDcEQsT0FBTyxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDckMsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxPQUFPLEVBQUU7WUFDUCxVQUFVLEVBQUUsTUFBTTtTQUNuQjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsbUJBQW1CLENBQUMsTUFBYyxFQUFFLEVBQVU7SUFDbEUsT0FBTyxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7UUFDdEMsS0FBSyxFQUFFO1lBQ0wsRUFBRTtZQUNGLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsRUFBVSxFQUFFLElBQXdCO0lBQzNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1FBQ3RELEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO0tBQy9CLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFDbkMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxFQUFFO1lBQ0osR0FBRyxJQUFJO1lBQ1AsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3ZCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsRUFBVTtJQUNqRSxNQUFNLFFBQVEsR0FBRyxNQUFNLGdCQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztRQUN0RCxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtLQUMvQixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sZ0JBQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1FBQ25DLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJpc21hIGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgQ3JlYXRlSm91cm5hbElucHV0LCBVcGRhdGVKb3VybmFsSW5wdXQgfSBmcm9tICcuL2pvdXJuYWwuc2NoZW1hJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUpvdXJuYWxFbnRyeSh1c2VySWQ6IHN0cmluZywgZGF0YTogQ3JlYXRlSm91cm5hbElucHV0KSB7XG4gIHJldHVybiBwcmlzbWEuam91cm5hbF9lbnRyaWVzLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEpvdXJuYWxFbnRyaWVzKHVzZXJJZDogc3RyaW5nKSB7XG4gIHJldHVybiBwcmlzbWEuam91cm5hbF9lbnRyaWVzLmZpbmRNYW55KHtcbiAgICB3aGVyZToge1xuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgIH0sXG4gICAgb3JkZXJCeToge1xuICAgICAgY3JlYXRlZF9hdDogJ2Rlc2MnLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Sm91cm5hbEVudHJ5QnlJZCh1c2VySWQ6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICByZXR1cm4gcHJpc21hLmpvdXJuYWxfZW50cmllcy5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7XG4gICAgICBpZCxcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUpvdXJuYWxFbnRyeSh1c2VySWQ6IHN0cmluZywgaWQ6IHN0cmluZywgZGF0YTogVXBkYXRlSm91cm5hbElucHV0KSB7XG4gIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcHJpc21hLmpvdXJuYWxfZW50cmllcy5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkLCB1c2VyX2lkOiB1c2VySWQgfSxcbiAgfSk7XG5cbiAgaWYgKCFleGlzdGluZykge1xuICAgIHRocm93IG5ldyBFcnJvcignSm91cm5hbCBlbnRyeSBub3QgZm91bmQnKTtcbiAgfVxuXG4gIHJldHVybiBwcmlzbWEuam91cm5hbF9lbnRyaWVzLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUpvdXJuYWxFbnRyeSh1c2VySWQ6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICBjb25zdCBleGlzdGluZyA9IGF3YWl0IHByaXNtYS5qb3VybmFsX2VudHJpZXMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZCwgdXNlcl9pZDogdXNlcklkIH0sXG4gIH0pO1xuXG4gIGlmICghZXhpc3RpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0pvdXJuYWwgZW50cnkgbm90IGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcHJpc21hLmpvdXJuYWxfZW50cmllcy5kZWxldGUoe1xuICAgIHdoZXJlOiB7IGlkIH0sXG4gIH0pO1xufVxuIl19