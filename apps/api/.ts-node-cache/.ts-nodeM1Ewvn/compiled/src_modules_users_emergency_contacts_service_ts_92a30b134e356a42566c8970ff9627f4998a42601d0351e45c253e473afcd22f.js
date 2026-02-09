"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmergencyContacts = getEmergencyContacts;
exports.createEmergencyContact = createEmergencyContact;
exports.updateEmergencyContact = updateEmergencyContact;
exports.deleteEmergencyContact = deleteEmergencyContact;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getEmergencyContacts(userId) {
    const contacts = await prisma_1.default.emergency_contacts.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
    });
    // Lazy migration: If no contacts in new table, check legacy profile fields
    if (contacts.length === 0) {
        const profile = await prisma_1.default.profiles.findUnique({
            where: { id: userId },
            select: {
                emergency_contact_name: true,
                emergency_contact_phone: true,
                emergency_contact_relationship: true,
            }
        });
        if (profile?.emergency_contact_name) {
            const newContact = await prisma_1.default.emergency_contacts.create({
                data: {
                    user_id: userId,
                    name: profile.emergency_contact_name,
                    phone: profile.emergency_contact_phone,
                    relationship: profile.emergency_contact_relationship,
                    is_trusted: true, // Assume legacy contact is trusted
                }
            });
            return [newContact];
        }
    }
    return contacts;
}
async function createEmergencyContact(userId, data) {
    // Fix email if empty string to null or leave it as is if DB allows.
    // Prisma schema says email String? so it can be null. 
    // Zod schema allows empty string or email.
    return prisma_1.default.emergency_contacts.create({
        data: {
            ...data,
            user_id: userId,
            email: data.email === '' ? null : data.email,
        },
    });
}
async function updateEmergencyContact(userId, contactId, data) {
    // Ensure the contact belongs to the user
    const contact = await prisma_1.default.emergency_contacts.findFirst({
        where: { id: contactId, user_id: userId },
    });
    if (!contact) {
        throw new Error('Contact not found or access denied');
    }
    return prisma_1.default.emergency_contacts.update({
        where: { id: contactId },
        data: {
            ...data,
            email: data.email === '' ? null : data.email,
        },
    });
}
async function deleteEmergencyContact(userId, contactId) {
    const contact = await prisma_1.default.emergency_contacts.findFirst({
        where: { id: contactId, user_id: userId },
    });
    if (!contact) {
        throw new Error('Contact not found or access denied');
    }
    return prisma_1.default.emergency_contacts.delete({
        where: { id: contactId },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy9lbWVyZ2VuY3ktY29udGFjdHMuc2VydmljZS50cyIsInNvdXJjZXMiOlsiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy9lbWVyZ2VuY3ktY29udGFjdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLG9EQWdDQztBQUVELHdEQVlDO0FBRUQsd0RBaUJDO0FBRUQsd0RBWUM7QUFsRkQsOERBQXNDO0FBRy9CLEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxNQUFjO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFDeEQsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUMxQixPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO0tBQ2hDLENBQUMsQ0FBQztJQUVILDJFQUEyRTtJQUMzRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDMUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7WUFDL0MsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ04sc0JBQXNCLEVBQUUsSUFBSTtnQkFDNUIsdUJBQXVCLEVBQUUsSUFBSTtnQkFDN0IsOEJBQThCLEVBQUUsSUFBSTthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxFQUFFLHNCQUFzQixFQUFFLENBQUM7WUFDcEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxnQkFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztnQkFDeEQsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxNQUFNO29CQUNmLElBQUksRUFBRSxPQUFPLENBQUMsc0JBQXNCO29CQUNwQyxLQUFLLEVBQUUsT0FBTyxDQUFDLHVCQUF1QjtvQkFDdEMsWUFBWSxFQUFFLE9BQU8sQ0FBQyw4QkFBOEI7b0JBQ3BELFVBQVUsRUFBRSxJQUFJLEVBQUUsbUNBQW1DO2lCQUN0RDthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFTSxLQUFLLFVBQVUsc0JBQXNCLENBQUMsTUFBYyxFQUFFLElBQWlDO0lBQzVGLG9FQUFvRTtJQUNwRSx1REFBdUQ7SUFDdkQsMkNBQTJDO0lBRTNDLE9BQU8sZ0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxFQUFFO1lBQ0osR0FBRyxJQUFJO1lBQ1AsT0FBTyxFQUFFLE1BQU07WUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7U0FDN0M7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxTQUFpQixFQUFFLElBQWlDO0lBQy9HLHlDQUF5QztJQUN6QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGdCQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1FBQ3hELEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtLQUMxQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELE9BQU8sZ0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7UUFDdEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtRQUN4QixJQUFJLEVBQUU7WUFDSixHQUFHLElBQUk7WUFDUCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7U0FDN0M7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxTQUFpQjtJQUM1RSxNQUFNLE9BQU8sR0FBRyxNQUFNLGdCQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1FBQ3hELEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtLQUMxQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELE9BQU8sZ0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7UUFDdEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtLQUN6QixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByaXNtYSBmcm9tICcuLi8uLi9saWIvcHJpc21hJztcbmltcG9ydCB7IENyZWF0ZUVtZXJnZW5jeUNvbnRhY3RJbnB1dCwgVXBkYXRlRW1lcmdlbmN5Q29udGFjdElucHV0IH0gZnJvbSAnLi9lbWVyZ2VuY3ktY29udGFjdHMuc2NoZW1hJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEVtZXJnZW5jeUNvbnRhY3RzKHVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRhY3RzID0gYXdhaXQgcHJpc21hLmVtZXJnZW5jeV9jb250YWN0cy5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgdXNlcl9pZDogdXNlcklkIH0sXG4gICAgb3JkZXJCeTogeyBjcmVhdGVkX2F0OiAnZGVzYycgfSxcbiAgfSk7XG5cbiAgLy8gTGF6eSBtaWdyYXRpb246IElmIG5vIGNvbnRhY3RzIGluIG5ldyB0YWJsZSwgY2hlY2sgbGVnYWN5IHByb2ZpbGUgZmllbGRzXG4gIGlmIChjb250YWN0cy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCB9LFxuICAgICAgc2VsZWN0OiB7XG4gICAgICAgIGVtZXJnZW5jeV9jb250YWN0X25hbWU6IHRydWUsXG4gICAgICAgIGVtZXJnZW5jeV9jb250YWN0X3Bob25lOiB0cnVlLFxuICAgICAgICBlbWVyZ2VuY3lfY29udGFjdF9yZWxhdGlvbnNoaXA6IHRydWUsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvZmlsZT8uZW1lcmdlbmN5X2NvbnRhY3RfbmFtZSkge1xuICAgICAgY29uc3QgbmV3Q29udGFjdCA9IGF3YWl0IHByaXNtYS5lbWVyZ2VuY3lfY29udGFjdHMuY3JlYXRlKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBuYW1lOiBwcm9maWxlLmVtZXJnZW5jeV9jb250YWN0X25hbWUsXG4gICAgICAgICAgcGhvbmU6IHByb2ZpbGUuZW1lcmdlbmN5X2NvbnRhY3RfcGhvbmUsXG4gICAgICAgICAgcmVsYXRpb25zaGlwOiBwcm9maWxlLmVtZXJnZW5jeV9jb250YWN0X3JlbGF0aW9uc2hpcCxcbiAgICAgICAgICBpc190cnVzdGVkOiB0cnVlLCAvLyBBc3N1bWUgbGVnYWN5IGNvbnRhY3QgaXMgdHJ1c3RlZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBbbmV3Q29udGFjdF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbnRhY3RzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRW1lcmdlbmN5Q29udGFjdCh1c2VySWQ6IHN0cmluZywgZGF0YTogQ3JlYXRlRW1lcmdlbmN5Q29udGFjdElucHV0KSB7XG4gIC8vIEZpeCBlbWFpbCBpZiBlbXB0eSBzdHJpbmcgdG8gbnVsbCBvciBsZWF2ZSBpdCBhcyBpcyBpZiBEQiBhbGxvd3MuXG4gIC8vIFByaXNtYSBzY2hlbWEgc2F5cyBlbWFpbCBTdHJpbmc/IHNvIGl0IGNhbiBiZSBudWxsLiBcbiAgLy8gWm9kIHNjaGVtYSBhbGxvd3MgZW1wdHkgc3RyaW5nIG9yIGVtYWlsLlxuICBcbiAgcmV0dXJuIHByaXNtYS5lbWVyZ2VuY3lfY29udGFjdHMuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICAuLi5kYXRhLFxuICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgZW1haWw6IGRhdGEuZW1haWwgPT09ICcnID8gbnVsbCA6IGRhdGEuZW1haWwsXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVFbWVyZ2VuY3lDb250YWN0KHVzZXJJZDogc3RyaW5nLCBjb250YWN0SWQ6IHN0cmluZywgZGF0YTogVXBkYXRlRW1lcmdlbmN5Q29udGFjdElucHV0KSB7XG4gIC8vIEVuc3VyZSB0aGUgY29udGFjdCBiZWxvbmdzIHRvIHRoZSB1c2VyXG4gIGNvbnN0IGNvbnRhY3QgPSBhd2FpdCBwcmlzbWEuZW1lcmdlbmN5X2NvbnRhY3RzLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGNvbnRhY3RJZCwgdXNlcl9pZDogdXNlcklkIH0sXG4gIH0pO1xuXG4gIGlmICghY29udGFjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29udGFjdCBub3QgZm91bmQgb3IgYWNjZXNzIGRlbmllZCcpO1xuICB9XG5cbiAgcmV0dXJuIHByaXNtYS5lbWVyZ2VuY3lfY29udGFjdHMudXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogY29udGFjdElkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uZGF0YSxcbiAgICAgIGVtYWlsOiBkYXRhLmVtYWlsID09PSAnJyA/IG51bGwgOiBkYXRhLmVtYWlsLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRW1lcmdlbmN5Q29udGFjdCh1c2VySWQ6IHN0cmluZywgY29udGFjdElkOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udGFjdCA9IGF3YWl0IHByaXNtYS5lbWVyZ2VuY3lfY29udGFjdHMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogY29udGFjdElkLCB1c2VyX2lkOiB1c2VySWQgfSxcbiAgfSk7XG5cbiAgaWYgKCFjb250YWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb250YWN0IG5vdCBmb3VuZCBvciBhY2Nlc3MgZGVuaWVkJyk7XG4gIH1cblxuICByZXR1cm4gcHJpc21hLmVtZXJnZW5jeV9jb250YWN0cy5kZWxldGUoe1xuICAgIHdoZXJlOiB7IGlkOiBjb250YWN0SWQgfSxcbiAgfSk7XG59XG4iXX0=