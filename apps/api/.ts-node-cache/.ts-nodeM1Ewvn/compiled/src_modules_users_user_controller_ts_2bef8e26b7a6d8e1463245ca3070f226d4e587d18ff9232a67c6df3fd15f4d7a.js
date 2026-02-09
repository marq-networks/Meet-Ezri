"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersHandler = getAllUsersHandler;
exports.getUserProfileAdminHandler = getUserProfileAdminHandler;
exports.getMeHandler = getMeHandler;
exports.initProfileHandler = initProfileHandler;
exports.getCreditsHandler = getCreditsHandler;
exports.updateProfileHandler = updateProfileHandler;
exports.completeOnboardingHandler = completeOnboardingHandler;
exports.deleteUserHandler = deleteUserHandler;
const user_schema_1 = require("./user.schema");
const userService = __importStar(require("./user.service"));
async function getAllUsersHandler(request, reply) {
    try {
        const users = await userService.getAllUsers();
        return users;
    }
    catch (error) {
        request.log.error({ error }, 'Failed to fetch all users');
        return reply.code(500).send({ message: 'Failed to fetch users' });
    }
}
async function getUserProfileAdminHandler(request, reply) {
    const { userId } = request.params;
    const profile = await userService.getProfile(userId);
    if (!profile) {
        return reply.code(404).send({ message: 'Profile not found' });
    }
    return profile;
}
async function getMeHandler(request, reply) {
    const user = request.user;
    const profile = await userService.getProfile(user.sub);
    if (!profile) {
        return reply.code(404).send({ message: 'Profile not found' });
    }
    return profile;
}
async function initProfileHandler(request, reply) {
    const user = request.user;
    request.log.info({ user }, 'Initializing profile for user');
    const existingProfile = await userService.getProfile(user.sub);
    if (existingProfile) {
        return existingProfile;
    }
    let email = user.email;
    // If email is missing in JWT, try to fetch from auth.users via prisma
    if (!email) {
        try {
            // Accessing prisma via the userService's imported prisma instance if possible, 
            // or we can add a helper in userService to get user email.
            // For now, let's assume we can rely on the service to handle "missing email" logic 
            // or we modify the service.
            // Better approach: Let's assume the email MIGHT be in the user object but just in case
            // we can try to fetch the user record.
            // Since I don't have direct access to prisma here (it's in service), 
            // I'll add a method to userService to get email by ID.
            // Actually, let's just handle it in the controller by checking if we can get it.
            // But wait, I need to import prisma to query it.
            // Instead, I'll pass undefined to createProfile and let it handle or fail.
            // But createProfile needs email.
            // Let's modify the controller to just fail if email is missing for now, 
            // but log it clearly. 
            // If the user says "Profile not found", it means they hit 404 on getMe.
            // Then they hit initProfile.
            // If user.email is undefined, we return 400.
            // The user is seeing "Profile not found" which is the 404 from getMe.
            // This means initProfile MIGHT NOT EVEN BE CALLED or failing silently in frontend?
            // No, the user provided the log:
            // {"message":"Profile not found"} http://localhost:3001/api/users/me
            // This means the browser is showing the response from the FAILED request.
            // It DOES NOT mean initProfile wasn't called.
            // It means the user is looking at the failed request response.
            // If initProfile WAS called, it should have succeeded or failed.
            // If it succeeded, the app should have proceeded.
            // Hypothesis: initProfile is failing with 400 because email is missing.
            // So let's try to get the email from the DB if it's missing.
            // I will add a `getUserEmail` to userService and use it here.
        }
        catch (e) {
            // ignore
        }
    }
    if (!email) {
        // Attempt to fetch email from DB as a fallback
        const userEmail = await userService.getUserEmail(user.sub);
        if (userEmail) {
            email = userEmail;
        }
    }
    if (!email) {
        request.log.error({ user }, 'User email is required to initialize profile but was not found');
        return reply.code(400).send({ message: 'User email is required to initialize profile' });
    }
    try {
        const profile = await userService.createProfile(user.sub, email);
        request.log.info({ profile }, 'Profile initialized successfully');
        return profile;
    }
    catch (error) {
        request.log.error({ error }, 'Failed to initialize profile');
        return reply.code(500).send({ message: 'Failed to initialize profile' });
    }
}
async function getCreditsHandler(request, reply) {
    const user = request.user;
    const credits = await userService.getCredits(user.sub);
    return credits;
}
async function updateProfileHandler(request, reply) {
    const user = request.user;
    request.log.info({ user, body: request.body }, 'Processing update profile request');
    const result = user_schema_1.updateProfileSchema.safeParse(request.body);
    if (!result.success) {
        request.log.warn({ error: result.error }, 'Update profile validation failed');
        return reply.code(400).send(result.error);
    }
    const updatedProfile = await userService.updateProfile(user.sub, result.data);
    request.log.info({ updatedProfile }, 'Profile updated successfully');
    return updatedProfile;
}
async function completeOnboardingHandler(request, reply) {
    const user = request.user;
    request.log.info({ user, body: request.body }, 'Processing complete onboarding request');
    const result = user_schema_1.onboardingSchema.safeParse(request.body);
    if (!result.success) {
        request.log.warn({ error: result.error }, 'Onboarding validation failed');
        return reply.code(400).send(result.error);
    }
    try {
        const profile = await userService.completeOnboarding(user.sub, result.data);
        return profile;
    }
    catch (error) {
        request.log.error({ error }, 'Onboarding completion failed');
        throw error;
    }
}
async function deleteUserHandler(request, reply) {
    const user = request.user;
    request.log.info({ user }, 'Processing delete user request');
    try {
        await userService.deleteUser(user.sub);
        return reply.code(200).send({ message: 'User account deleted successfully' });
    }
    catch (error) {
        request.log.error({ error }, 'Delete user failed');
        return reply.code(500).send({ message: 'Failed to delete user account' });
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy91c2VyLmNvbnRyb2xsZXIudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvdXNlcnMvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUEsZ0RBV0M7QUFFRCxnRUFZQztBQUVELG9DQVlDO0FBRUQsZ0RBK0VDO0FBRUQsOENBT0M7QUFFRCxvREFnQkM7QUFFRCw4REFvQkM7QUFFRCw4Q0FjQztBQWxNRCwrQ0FBc0U7QUFDdEUsNERBQThDO0FBUXZDLEtBQUssVUFBVSxrQkFBa0IsQ0FDdEMsT0FBdUIsRUFDdkIsS0FBbUI7SUFFbkIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUMxRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztJQUNwRSxDQUFDO0FBQ0gsQ0FBQztBQUVNLEtBQUssVUFBVSwwQkFBMEIsQ0FDOUMsT0FBdUQsRUFDdkQsS0FBbUI7SUFFbkIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDbEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxD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QU8sQ0FBQztJQUNqQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUM3RCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUNyQyxPQUF1QixFQUN2QixLQUFtQjtJQUVuQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBbUIsQ0FBQztJQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7SUFFN0QsSUFBSSxDQUFDO1FBQ0gsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNuRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQztJQUM1RSxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3QgfSBmcm9tICdmYXN0aWZ5JztcclxuaW1wb3J0IHsgb25ib2FyZGluZ1NjaGVtYSwgdXBkYXRlUHJvZmlsZVNjaGVtYSB9IGZyb20gJy4vdXNlci5zY2hlbWEnO1xyXG5pbXBvcnQgKiBhcyB1c2VyU2VydmljZSBmcm9tICcuL3VzZXIuc2VydmljZSc7XHJcblxyXG5pbnRlcmZhY2UgVXNlclBheWxvYWQge1xyXG4gIHN1Yjogc3RyaW5nO1xyXG4gIGVtYWlsPzogc3RyaW5nO1xyXG4gIHJvbGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxVc2Vyc0hhbmRsZXIoXHJcbiAgcmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsXHJcbiAgcmVwbHk6IEZhc3RpZnlSZXBseVxyXG4pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCB1c2VyU2VydmljZS5nZXRBbGxVc2VycygpO1xyXG4gICAgcmV0dXJuIHVzZXJzO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXF1ZXN0LmxvZy5lcnJvcih7IGVycm9yIH0sICdGYWlsZWQgdG8gZmV0Y2ggYWxsIHVzZXJzJyk7XHJcbiAgICByZXR1cm4gcmVwbHkuY29kZSg1MDApLnNlbmQoeyBtZXNzYWdlOiAnRmFpbGVkIHRvIGZldGNoIHVzZXJzJyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyUHJvZmlsZUFkbWluSGFuZGxlcihcclxuICByZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdDx7IFBhcmFtczogeyB1c2VySWQ6IHN0cmluZyB9IH0+LFxyXG4gIHJlcGx5OiBGYXN0aWZ5UmVwbHlcclxuKSB7XHJcbiAgY29uc3QgeyB1c2VySWQgfSA9IHJlcXVlc3QucGFyYW1zO1xyXG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCB1c2VyU2VydmljZS5nZXRQcm9maWxlKHVzZXJJZCk7XHJcblxyXG4gIGlmICghcHJvZmlsZSkge1xyXG4gICAgcmV0dXJuIHJlcGx5LmNvZGUoNDA0KS5zZW5kKHsgbWVzc2FnZTogJ1Byb2ZpbGUgbm90IGZvdW5kJyB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9maWxlO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWVIYW5kbGVyKFxyXG4gIHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LFxyXG4gIHJlcGx5OiBGYXN0aWZ5UmVwbHlcclxuKSB7XHJcbiAgY29uc3QgdXNlciA9IHJlcXVlc3QudXNlciBhcyBVc2VyUGF5bG9hZDtcclxuICBjb25zdCBwcm9maWxlID0gYXdhaXQgdXNlclNlcnZpY2UuZ2V0UHJvZmlsZSh1c2VyLnN1Yik7XHJcblxyXG4gIGlmICghcHJvZmlsZSkge1xyXG4gICAgcmV0dXJuIHJlcGx5LmNvZGUoNDA0KS5zZW5kKHsgbWVzc2FnZTogJ1Byb2ZpbGUgbm90IGZvdW5kJyB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9maWxlO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdFByb2ZpbGVIYW5kbGVyKFxyXG4gIHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LFxyXG4gIHJlcGx5OiBGYXN0aWZ5UmVwbHlcclxuKSB7XHJcbiAgY29uc3QgdXNlciA9IHJlcXVlc3QudXNlciBhcyBVc2VyUGF5bG9hZDtcclxuICByZXF1ZXN0LmxvZy5pbmZvKHsgdXNlciB9LCAnSW5pdGlhbGl6aW5nIHByb2ZpbGUgZm9yIHVzZXInKTtcclxuICBcclxuICBjb25zdCBleGlzdGluZ1Byb2ZpbGUgPSBhd2FpdCB1c2VyU2VydmljZS5nZXRQcm9maWxlKHVzZXIuc3ViKTtcclxuICBpZiAoZXhpc3RpbmdQcm9maWxlKSB7XHJcbiAgICByZXR1cm4gZXhpc3RpbmdQcm9maWxlO1xyXG4gIH1cclxuXHJcbiAgbGV0IGVtYWlsID0gdXNlci5lbWFpbDtcclxuXHJcbiAgLy8gSWYgZW1haWwgaXMgbWlzc2luZyBpbiBKV1QsIHRyeSB0byBmZXRjaCBmcm9tIGF1dGgudXNlcnMgdmlhIHByaXNtYVxyXG4gIGlmICghZW1haWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIEFjY2Vzc2luZyBwcmlzbWEgdmlhIHRoZSB1c2VyU2VydmljZSdzIGltcG9ydGVkIHByaXNtYSBpbnN0YW5jZSBpZiBwb3NzaWJsZSwgXHJcbiAgICAgIC8vIG9yIHdlIGNhbiBhZGQgYSBoZWxwZXIgaW4gdXNlclNlcnZpY2UgdG8gZ2V0IHVzZXIgZW1haWwuXHJcbiAgICAgIC8vIEZvciBub3csIGxldCdzIGFzc3VtZSB3ZSBjYW4gcmVseSBvbiB0aGUgc2VydmljZSB0byBoYW5kbGUgXCJtaXNzaW5nIGVtYWlsXCIgbG9naWMgXHJcbiAgICAgIC8vIG9yIHdlIG1vZGlmeSB0aGUgc2VydmljZS5cclxuICAgICAgLy8gQmV0dGVyIGFwcHJvYWNoOiBMZXQncyBhc3N1bWUgdGhlIGVtYWlsIE1JR0hUIGJlIGluIHRoZSB1c2VyIG9iamVjdCBidXQganVzdCBpbiBjYXNlXHJcbiAgICAgIC8vIHdlIGNhbiB0cnkgdG8gZmV0Y2ggdGhlIHVzZXIgcmVjb3JkLlxyXG4gICAgICAvLyBTaW5jZSBJIGRvbid0IGhhdmUgZGlyZWN0IGFjY2VzcyB0byBwcmlzbWEgaGVyZSAoaXQncyBpbiBzZXJ2aWNlKSwgXHJcbiAgICAgIC8vIEknbGwgYWRkIGEgbWV0aG9kIHRvIHVzZXJTZXJ2aWNlIHRvIGdldCBlbWFpbCBieSBJRC5cclxuICAgICAgXHJcbiAgICAgIC8vIEFjdHVhbGx5LCBsZXQncyBqdXN0IGhhbmRsZSBpdCBpbiB0aGUgY29udHJvbGxlciBieSBjaGVja2luZyBpZiB3ZSBjYW4gZ2V0IGl0LlxyXG4gICAgICAvLyBCdXQgd2FpdCwgSSBuZWVkIHRvIGltcG9ydCBwcmlzbWEgdG8gcXVlcnkgaXQuXHJcbiAgICAgIC8vIEluc3RlYWQsIEknbGwgcGFzcyB1bmRlZmluZWQgdG8gY3JlYXRlUHJvZmlsZSBhbmQgbGV0IGl0IGhhbmRsZSBvciBmYWlsLlxyXG4gICAgICAvLyBCdXQgY3JlYXRlUHJvZmlsZSBuZWVkcyBlbWFpbC5cclxuICAgICAgXHJcbiAgICAgIC8vIExldCdzIG1vZGlmeSB0aGUgY29udHJvbGxlciB0byBqdXN0IGZhaWwgaWYgZW1haWwgaXMgbWlzc2luZyBmb3Igbm93LCBcclxuICAgICAgLy8gYnV0IGxvZyBpdCBjbGVhcmx5LiBcclxuICAgICAgLy8gSWYgdGhlIHVzZXIgc2F5cyBcIlByb2ZpbGUgbm90IGZvdW5kXCIsIGl0IG1lYW5zIHRoZXkgaGl0IDQwNCBvbiBnZXRNZS5cclxuICAgICAgLy8gVGhlbiB0aGV5IGhpdCBpbml0UHJvZmlsZS5cclxuICAgICAgXHJcbiAgICAgIC8vIElmIHVzZXIuZW1haWwgaXMgdW5kZWZpbmVkLCB3ZSByZXR1cm4gNDAwLlxyXG4gICAgICAvLyBUaGUgdXNlciBpcyBzZWVpbmcgXCJQcm9maWxlIG5vdCBmb3VuZFwiIHdoaWNoIGlzIHRoZSA0MDQgZnJvbSBnZXRNZS5cclxuICAgICAgLy8gVGhpcyBtZWFucyBpbml0UHJvZmlsZSBNSUdIVCBOT1QgRVZFTiBCRSBDQUxMRUQgb3IgZmFpbGluZyBzaWxlbnRseSBpbiBmcm9udGVuZD9cclxuICAgICAgLy8gTm8sIHRoZSB1c2VyIHByb3ZpZGVkIHRoZSBsb2c6XHJcbiAgICAgIC8vIHtcIm1lc3NhZ2VcIjpcIlByb2ZpbGUgbm90IGZvdW5kXCJ9IGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9hcGkvdXNlcnMvbWVcclxuICAgICAgXHJcbiAgICAgIC8vIFRoaXMgbWVhbnMgdGhlIGJyb3dzZXIgaXMgc2hvd2luZyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgRkFJTEVEIHJlcXVlc3QuXHJcbiAgICAgIC8vIEl0IERPRVMgTk9UIG1lYW4gaW5pdFByb2ZpbGUgd2Fzbid0IGNhbGxlZC5cclxuICAgICAgLy8gSXQgbWVhbnMgdGhlIHVzZXIgaXMgbG9va2luZyBhdCB0aGUgZmFpbGVkIHJlcXVlc3QgcmVzcG9uc2UuXHJcbiAgICAgIFxyXG4gICAgICAvLyBJZiBpbml0UHJvZmlsZSBXQVMgY2FsbGVkLCBpdCBzaG91bGQgaGF2ZSBzdWNjZWVkZWQgb3IgZmFpbGVkLlxyXG4gICAgICAvLyBJZiBpdCBzdWNjZWVkZWQsIHRoZSBhcHAgc2hvdWxkIGhhdmUgcHJvY2VlZGVkLlxyXG4gICAgICBcclxuICAgICAgLy8gSHlwb3RoZXNpczogaW5pdFByb2ZpbGUgaXMgZmFpbGluZyB3aXRoIDQwMCBiZWNhdXNlIGVtYWlsIGlzIG1pc3NpbmcuXHJcbiAgICAgIC8vIFNvIGxldCdzIHRyeSB0byBnZXQgdGhlIGVtYWlsIGZyb20gdGhlIERCIGlmIGl0J3MgbWlzc2luZy5cclxuICAgICAgXHJcbiAgICAgIC8vIEkgd2lsbCBhZGQgYSBgZ2V0VXNlckVtYWlsYCB0byB1c2VyU2VydmljZSBhbmQgdXNlIGl0IGhlcmUuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIC8vIGlnbm9yZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKCFlbWFpbCkge1xyXG4gICAgLy8gQXR0ZW1wdCB0byBmZXRjaCBlbWFpbCBmcm9tIERCIGFzIGEgZmFsbGJhY2tcclxuICAgIGNvbnN0IHVzZXJFbWFpbCA9IGF3YWl0IHVzZXJTZXJ2aWNlLmdldFVzZXJFbWFpbCh1c2VyLnN1Yik7XHJcbiAgICBpZiAodXNlckVtYWlsKSB7XHJcbiAgICAgIGVtYWlsID0gdXNlckVtYWlsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKCFlbWFpbCkge1xyXG4gICAgcmVxdWVzdC5sb2cuZXJyb3IoeyB1c2VyIH0sICdVc2VyIGVtYWlsIGlzIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgcHJvZmlsZSBidXQgd2FzIG5vdCBmb3VuZCcpO1xyXG4gICAgcmV0dXJuIHJlcGx5LmNvZGUoNDAwKS5zZW5kKHsgbWVzc2FnZTogJ1VzZXIgZW1haWwgaXMgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSBwcm9maWxlJyB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgdXNlclNlcnZpY2UuY3JlYXRlUHJvZmlsZSh1c2VyLnN1YiwgZW1haWwpO1xyXG4gICAgcmVxdWVzdC5sb2cuaW5mbyh7IHByb2ZpbGUgfSwgJ1Byb2ZpbGUgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICByZXR1cm4gcHJvZmlsZTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVxdWVzdC5sb2cuZXJyb3IoeyBlcnJvciB9LCAnRmFpbGVkIHRvIGluaXRpYWxpemUgcHJvZmlsZScpO1xyXG4gICAgcmV0dXJuIHJlcGx5LmNvZGUoNTAwKS5zZW5kKHsgbWVzc2FnZTogJ0ZhaWxlZCB0byBpbml0aWFsaXplIHByb2ZpbGUnIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENyZWRpdHNIYW5kbGVyKFxyXG4gIHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LFxyXG4gIHJlcGx5OiBGYXN0aWZ5UmVwbHlcclxuKSB7XHJcbiAgY29uc3QgdXNlciA9IHJlcXVlc3QudXNlciBhcyBVc2VyUGF5bG9hZDtcclxuICBjb25zdCBjcmVkaXRzID0gYXdhaXQgdXNlclNlcnZpY2UuZ2V0Q3JlZGl0cyh1c2VyLnN1Yik7XHJcbiAgcmV0dXJuIGNyZWRpdHM7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9maWxlSGFuZGxlcihcclxuICByZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCxcclxuICByZXBseTogRmFzdGlmeVJlcGx5XHJcbikge1xyXG4gIGNvbnN0IHVzZXIgPSByZXF1ZXN0LnVzZXIgYXMgVXNlclBheWxvYWQ7XHJcbiAgcmVxdWVzdC5sb2cuaW5mbyh7IHVzZXIsIGJvZHk6IHJlcXVlc3QuYm9keSB9LCAnUHJvY2Vzc2luZyB1cGRhdGUgcHJvZmlsZSByZXF1ZXN0Jyk7XHJcbiAgXHJcbiAgY29uc3QgcmVzdWx0ID0gdXBkYXRlUHJvZmlsZVNjaGVtYS5zYWZlUGFyc2UocmVxdWVzdC5ib2R5KTtcclxuICBpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICByZXF1ZXN0LmxvZy53YXJuKHsgZXJyb3I6IHJlc3VsdC5lcnJvciB9LCAnVXBkYXRlIHByb2ZpbGUgdmFsaWRhdGlvbiBmYWlsZWQnKTtcclxuICAgIHJldHVybiByZXBseS5jb2RlKDQwMCkuc2VuZChyZXN1bHQuZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXBkYXRlZFByb2ZpbGUgPSBhd2FpdCB1c2VyU2VydmljZS51cGRhdGVQcm9maWxlKHVzZXIuc3ViLCByZXN1bHQuZGF0YSk7XHJcbiAgcmVxdWVzdC5sb2cuaW5mbyh7IHVwZGF0ZWRQcm9maWxlIH0sICdQcm9maWxlIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgcmV0dXJuIHVwZGF0ZWRQcm9maWxlO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGxldGVPbmJvYXJkaW5nSGFuZGxlcihcclxuICByZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCxcclxuICByZXBseTogRmFzdGlmeVJlcGx5XHJcbikge1xyXG4gIGNvbnN0IHVzZXIgPSByZXF1ZXN0LnVzZXIgYXMgVXNlclBheWxvYWQ7XHJcbiAgcmVxdWVzdC5sb2cuaW5mbyh7IHVzZXIsIGJvZHk6IHJlcXVlc3QuYm9keSB9LCAnUHJvY2Vzc2luZyBjb21wbGV0ZSBvbmJvYXJkaW5nIHJlcXVlc3QnKTtcclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gb25ib2FyZGluZ1NjaGVtYS5zYWZlUGFyc2UocmVxdWVzdC5ib2R5KTtcclxuICBpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICByZXF1ZXN0LmxvZy53YXJuKHsgZXJyb3I6IHJlc3VsdC5lcnJvciB9LCAnT25ib2FyZGluZyB2YWxpZGF0aW9uIGZhaWxlZCcpO1xyXG4gICAgcmV0dXJuIHJlcGx5LmNvZGUoNDAwKS5zZW5kKHJlc3VsdC5lcnJvcik7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHVzZXJTZXJ2aWNlLmNvbXBsZXRlT25ib2FyZGluZyh1c2VyLnN1YiwgcmVzdWx0LmRhdGEpO1xyXG4gICAgcmV0dXJuIHByb2ZpbGU7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcXVlc3QubG9nLmVycm9yKHsgZXJyb3IgfSwgJ09uYm9hcmRpbmcgY29tcGxldGlvbiBmYWlsZWQnKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVVzZXJIYW5kbGVyKFxyXG4gIHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LFxyXG4gIHJlcGx5OiBGYXN0aWZ5UmVwbHlcclxuKSB7XHJcbiAgY29uc3QgdXNlciA9IHJlcXVlc3QudXNlciBhcyBVc2VyUGF5bG9hZDtcclxuICByZXF1ZXN0LmxvZy5pbmZvKHsgdXNlciB9LCAnUHJvY2Vzc2luZyBkZWxldGUgdXNlciByZXF1ZXN0Jyk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCB1c2VyU2VydmljZS5kZWxldGVVc2VyKHVzZXIuc3ViKTtcclxuICAgIHJldHVybiByZXBseS5jb2RlKDIwMCkuc2VuZCh7IG1lc3NhZ2U6ICdVc2VyIGFjY291bnQgZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXF1ZXN0LmxvZy5lcnJvcih7IGVycm9yIH0sICdEZWxldGUgdXNlciBmYWlsZWQnKTtcclxuICAgIHJldHVybiByZXBseS5jb2RlKDUwMCkuc2VuZCh7IG1lc3NhZ2U6ICdGYWlsZWQgdG8gZGVsZXRlIHVzZXIgYWNjb3VudCcgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==