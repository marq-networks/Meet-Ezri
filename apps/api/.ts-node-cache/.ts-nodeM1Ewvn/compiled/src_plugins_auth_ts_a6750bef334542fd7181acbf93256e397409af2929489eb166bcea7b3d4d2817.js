"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            // Force allowedAlgorithms to ensure fast-jwt accepts ES256/RS256
            // even if global config isn't propagated correctly to local verifier
            await request.jwtVerify({
                allowedAlgorithms: ['HS256', 'RS256', 'ES256', 'PS256']
            });
            // Fetch user role from database and attach to request.user
            const user = request.user;
            if (user && user.sub) {
                const profile = await prisma_1.default.profiles.findUnique({
                    where: { id: user.sub },
                    select: { role: true, permissions: true }
                });
                if (profile) {
                    user.appRole = profile.role; // Use appRole to avoid conflict with Supabase role
                    user.permissions = profile.permissions;
                }
            }
        }
        catch (err) {
            reply.send(err);
        }
    });
    fastify.decorate('authorize', (allowedRoles) => {
        return async (request, reply) => {
            const user = request.user;
            // If no user or no appRole, deny
            if (!user || !user.appRole) {
                reply.code(403).send({
                    statusCode: 403,
                    error: 'Forbidden',
                    message: 'Access denied: No role assigned'
                });
                return;
            }
            // Check if user has one of the allowed roles
            if (!allowedRoles.includes(user.appRole)) {
                reply.code(403).send({
                    statusCode: 403,
                    error: 'Forbidden',
                    message: `Access denied: Requires one of [${allowedRoles.join(', ')}] role`
                });
                return;
            }
        };
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvcGx1Z2lucy9hdXRoLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9wbHVnaW5zL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBZ0M7QUFFaEMsMkRBQW1DO0FBRW5DLGtCQUFlLElBQUEsd0JBQUUsRUFBQyxLQUFLLEVBQUUsT0FBd0IsRUFBRSxFQUFFO0lBQ25ELE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxPQUF1QixFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUN0RixJQUFJLENBQUM7WUFDSCxpRUFBaUU7WUFDakUscUVBQXFFO1lBQ3JFLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDdEIsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7YUFDakQsQ0FBQyxDQUFDO1lBRVYsMkRBQTJEO1lBQzNELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFXLENBQUM7WUFDakMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixNQUFNLE9BQU8sR0FBRyxNQUFNLGdCQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztvQkFDL0MsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ3ZCLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtpQkFDMUMsQ0FBQyxDQUFDO2dCQUVILElBQUksT0FBTyxFQUFFLENBQUM7b0JBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsbURBQW1EO29CQUNoRixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ3pDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsWUFBc0IsRUFBRSxFQUFFO1FBQ3ZELE9BQU8sS0FBSyxFQUFFLE9BQXVCLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1lBQzVELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFXLENBQUM7WUFFakMsaUNBQWlDO1lBQ2pDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNuQixVQUFVLEVBQUUsR0FBRztvQkFDZixLQUFLLEVBQUUsV0FBVztvQkFDbEIsT0FBTyxFQUFFLGlDQUFpQztpQkFDM0MsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDVCxDQUFDO1lBRUQsNkNBQTZDO1lBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUN6QyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsVUFBVSxFQUFFLEdBQUc7b0JBQ2YsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLE9BQU8sRUFBRSxtQ0FBbUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtpQkFDNUUsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDVCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcCBmcm9tICdmYXN0aWZ5LXBsdWdpbic7XG5pbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UsIEZhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3QgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCBwcmlzbWEgZnJvbSAnLi4vbGliL3ByaXNtYSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZwKGFzeW5jIChmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UpID0+IHtcbiAgZmFzdGlmeS5kZWNvcmF0ZSgnYXV0aGVudGljYXRlJywgYXN5bmMgKHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LCByZXBseTogRmFzdGlmeVJlcGx5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEZvcmNlIGFsbG93ZWRBbGdvcml0aG1zIHRvIGVuc3VyZSBmYXN0LWp3dCBhY2NlcHRzIEVTMjU2L1JTMjU2XG4gICAgICAvLyBldmVuIGlmIGdsb2JhbCBjb25maWcgaXNuJ3QgcHJvcGFnYXRlZCBjb3JyZWN0bHkgdG8gbG9jYWwgdmVyaWZpZXJcbiAgICAgIGF3YWl0IHJlcXVlc3Quand0VmVyaWZ5KHtcbiAgICAgICAgYWxsb3dlZEFsZ29yaXRobXM6IFsnSFMyNTYnLCAnUlMyNTYnLCAnRVMyNTYnLCAnUFMyNTYnXVxuICAgICAgfSBhcyBhbnkpO1xuXG4gICAgICAvLyBGZXRjaCB1c2VyIHJvbGUgZnJvbSBkYXRhYmFzZSBhbmQgYXR0YWNoIHRvIHJlcXVlc3QudXNlclxuICAgICAgY29uc3QgdXNlciA9IHJlcXVlc3QudXNlciBhcyBhbnk7XG4gICAgICBpZiAodXNlciAmJiB1c2VyLnN1Yikge1xuICAgICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGVzLmZpbmRVbmlxdWUoe1xuICAgICAgICAgIHdoZXJlOiB7IGlkOiB1c2VyLnN1YiB9LFxuICAgICAgICAgIHNlbGVjdDogeyByb2xlOiB0cnVlLCBwZXJtaXNzaW9uczogdHJ1ZSB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICB1c2VyLmFwcFJvbGUgPSBwcm9maWxlLnJvbGU7IC8vIFVzZSBhcHBSb2xlIHRvIGF2b2lkIGNvbmZsaWN0IHdpdGggU3VwYWJhc2Ugcm9sZVxuICAgICAgICAgIHVzZXIucGVybWlzc2lvbnMgPSBwcm9maWxlLnBlcm1pc3Npb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXBseS5zZW5kKGVycik7XG4gICAgfVxuICB9KTtcblxuICBmYXN0aWZ5LmRlY29yYXRlKCdhdXRob3JpemUnLCAoYWxsb3dlZFJvbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIHJldHVybiBhc3luYyAocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlcGx5OiBGYXN0aWZ5UmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSByZXF1ZXN0LnVzZXIgYXMgYW55O1xuICAgICAgXG4gICAgICAvLyBJZiBubyB1c2VyIG9yIG5vIGFwcFJvbGUsIGRlbnlcbiAgICAgIGlmICghdXNlciB8fCAhdXNlci5hcHBSb2xlKSB7XG4gICAgICAgIHJlcGx5LmNvZGUoNDAzKS5zZW5kKHsgXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGVycm9yOiAnRm9yYmlkZGVuJyxcbiAgICAgICAgICBtZXNzYWdlOiAnQWNjZXNzIGRlbmllZDogTm8gcm9sZSBhc3NpZ25lZCcgXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIHVzZXIgaGFzIG9uZSBvZiB0aGUgYWxsb3dlZCByb2xlc1xuICAgICAgaWYgKCFhbGxvd2VkUm9sZXMuaW5jbHVkZXModXNlci5hcHBSb2xlKSkge1xuICAgICAgICByZXBseS5jb2RlKDQwMykuc2VuZCh7IFxuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBlcnJvcjogJ0ZvcmJpZGRlbicsXG4gICAgICAgICAgbWVzc2FnZTogYEFjY2VzcyBkZW5pZWQ6IFJlcXVpcmVzIG9uZSBvZiBbJHthbGxvd2VkUm9sZXMuam9pbignLCAnKX1dIHJvbGVgIFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSk7XG5cbmRlY2xhcmUgbW9kdWxlICdmYXN0aWZ5JyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgRmFzdGlmeUluc3RhbmNlIHtcbiAgICBhdXRoZW50aWNhdGU6IGFueTtcbiAgICBhdXRob3JpemU6IChhbGxvd2VkUm9sZXM6IHN0cmluZ1tdKSA9PiBhbnk7XG4gIH1cbn1cbiJdfQ==