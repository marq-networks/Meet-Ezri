"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMood = createMood;
exports.getMoodsByUserId = getMoodsByUserId;
exports.getAllMoods = getAllMoods;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function createMood(userId, input) {
    // Update user profile current mood as well
    await prisma_1.default.profiles.update({
        where: { id: userId },
        data: { current_mood: input.mood },
    });
    return prisma_1.default.mood_entries.create({
        data: {
            user_id: userId,
            mood: input.mood,
            intensity: input.intensity,
            activities: input.activities,
            notes: input.notes,
        },
    });
}
async function getMoodsByUserId(userId) {
    return prisma_1.default.mood_entries.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
    });
}
async function getAllMoods() {
    return prisma_1.default.mood_entries.findMany({
        orderBy: { created_at: "desc" },
        include: {
            profiles: {
                select: {
                    email: true,
                    full_name: true,
                },
            },
        },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9tb29kcy9tb29kcy5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL21vb2RzL21vb2RzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxnQ0FnQkM7QUFFRCw0Q0FLQztBQUVELGtDQVlDO0FBeENELDhEQUFzQztBQUcvQixLQUFLLFVBQVUsVUFBVSxDQUFDLE1BQWMsRUFBRSxLQUFzQjtJQUNyRSwyQ0FBMkM7SUFDM0MsTUFBTSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDM0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtRQUNyQixJQUFJLEVBQUUsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTtLQUNuQyxDQUFDLENBQUM7SUFFSCxPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsTUFBTTtZQUNmLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDMUIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztTQUNuQjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBYztJQUNuRCxPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO1FBQzFCLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7S0FDaEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxXQUFXO0lBQy9CLE9BQU8sZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ2xDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7UUFDL0IsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsSUFBSTtvQkFDWCxTQUFTLEVBQUUsSUFBSTtpQkFDaEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwcmlzbWEgZnJvbSBcIi4uLy4uL2xpYi9wcmlzbWFcIjtcclxuaW1wb3J0IHsgQ3JlYXRlTW9vZElucHV0IH0gZnJvbSBcIi4vbW9vZHMuc2NoZW1hXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlTW9vZCh1c2VySWQ6IHN0cmluZywgaW5wdXQ6IENyZWF0ZU1vb2RJbnB1dCkge1xyXG4gIC8vIFVwZGF0ZSB1c2VyIHByb2ZpbGUgY3VycmVudCBtb29kIGFzIHdlbGxcclxuICBhd2FpdCBwcmlzbWEucHJvZmlsZXMudXBkYXRlKHtcclxuICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgIGRhdGE6IHsgY3VycmVudF9tb29kOiBpbnB1dC5tb29kIH0sXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBwcmlzbWEubW9vZF9lbnRyaWVzLmNyZWF0ZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcclxuICAgICAgbW9vZDogaW5wdXQubW9vZCxcclxuICAgICAgaW50ZW5zaXR5OiBpbnB1dC5pbnRlbnNpdHksXHJcbiAgICAgIGFjdGl2aXRpZXM6IGlucHV0LmFjdGl2aXRpZXMsXHJcbiAgICAgIG5vdGVzOiBpbnB1dC5ub3RlcyxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNb29kc0J5VXNlcklkKHVzZXJJZDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHByaXNtYS5tb29kX2VudHJpZXMuZmluZE1hbnkoe1xyXG4gICAgd2hlcmU6IHsgdXNlcl9pZDogdXNlcklkIH0sXHJcbiAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6IFwiZGVzY1wiIH0sXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxNb29kcygpIHtcclxuICByZXR1cm4gcHJpc21hLm1vb2RfZW50cmllcy5maW5kTWFueSh7XHJcbiAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6IFwiZGVzY1wiIH0sXHJcbiAgICBpbmNsdWRlOiB7XHJcbiAgICAgIHByb2ZpbGVzOiB7XHJcbiAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICBlbWFpbDogdHJ1ZSxcclxuICAgICAgICAgIGZ1bGxfbmFtZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iXX0=