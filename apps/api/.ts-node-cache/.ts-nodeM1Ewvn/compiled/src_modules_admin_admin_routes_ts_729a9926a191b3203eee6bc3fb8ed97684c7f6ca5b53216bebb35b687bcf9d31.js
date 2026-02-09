"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const admin_controller_1 = require("./admin.controller");
const admin_schema_1 = require("./admin.schema");
const zod_1 = require("zod");
async function adminRoutes(fastify) {
    fastify.get('/stats', {
        preHandler: [fastify.authenticate],
        schema: {
            response: {
                200: admin_schema_1.dashboardStatsSchema,
            },
        },
    }, admin_controller_1.getDashboardStatsHandler);
    fastify.get('/users', {
        preHandler: [fastify.authenticate],
        schema: {
            response: {
                200: admin_schema_1.userListSchema,
            },
        },
    }, admin_controller_1.getUsersHandler);
    fastify.get('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            response: {
                200: admin_schema_1.userSchema,
            },
        },
    }, admin_controller_1.getUserHandler);
    fastify.patch('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            body: admin_schema_1.updateUserSchema,
            response: {
                200: admin_schema_1.userSchema,
            },
        },
    }, admin_controller_1.updateUserHandler);
    fastify.delete('/users/:id', {
        preHandler: [fastify.authenticate],
    }, admin_controller_1.deleteUserHandler);
    fastify.get('/users/:id/audit-logs', {
        preHandler: [fastify.authenticate],
        schema: {
            response: {
                200: zod_1.z.array(zod_1.z.object({
                    id: zod_1.z.string(),
                    action: zod_1.z.string(),
                    created_at: zod_1.z.date(),
                    details: zod_1.z.any().optional(),
                })),
            },
        },
    }, admin_controller_1.getUserAuditLogsHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9hZG1pbi9hZG1pbi5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvYWRtaW4vYWRtaW4ucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esa0NBK0VDO0FBbkZELHlEQUE4SjtBQUM5SixpREFBb0c7QUFDcEcsNkJBQXdCO0FBRWpCLEtBQUssVUFBVSxXQUFXLENBQUMsT0FBd0I7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FDVCxRQUFRLEVBQ1I7UUFDRSxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ2xDLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsbUNBQW9CO2FBQzFCO1NBQ0Y7S0FDRixFQUNELDJDQUF3QixDQUN6QixDQUFDO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FDVCxRQUFRLEVBQ1I7UUFDRSxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ2xDLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsNkJBQWM7YUFDcEI7U0FDRjtLQUNGLEVBQ0Qsa0NBQWUsQ0FDaEIsQ0FBQztJQUVGLE9BQU8sQ0FBQyxHQUFHLENBQ1QsWUFBWSxFQUNaO1FBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNsQyxNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHlCQUFVO2FBQ2hCO1NBQ0Y7S0FDRixFQUNELGlDQUFjLENBQ2YsQ0FBQztJQUVGLE9BQU8sQ0FBQyxLQUFLLENBQ1gsWUFBWSxFQUNaO1FBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNsQyxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsK0JBQWdCO1lBQ3RCLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUseUJBQVU7YUFDaEI7U0FDRjtLQUNGLEVBQ0Qsb0NBQWlCLENBQ2xCLENBQUM7SUFFRixPQUFPLENBQUMsTUFBTSxDQUNaLFlBQVksRUFDWjtRQUNFLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7S0FDbkMsRUFDRCxvQ0FBaUIsQ0FDbEIsQ0FBQztJQUVGLE9BQU8sQ0FBQyxHQUFHLENBQ1QsdUJBQXVCLEVBQ3ZCO1FBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNsQyxNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDcEIsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7b0JBQ2QsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7b0JBQ2xCLFVBQVUsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFO29CQUNwQixPQUFPLEVBQUUsT0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtpQkFDNUIsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtLQUNGLEVBQ0QsMENBQXVCLENBQ3hCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmFzdGlmeUluc3RhbmNlIH0gZnJvbSAnZmFzdGlmeSc7XHJcbmltcG9ydCB7IGdldERhc2hib2FyZFN0YXRzSGFuZGxlciwgZ2V0VXNlcnNIYW5kbGVyLCBnZXRVc2VySGFuZGxlciwgdXBkYXRlVXNlckhhbmRsZXIsIGRlbGV0ZVVzZXJIYW5kbGVyLCBnZXRVc2VyQXVkaXRMb2dzSGFuZGxlciB9IGZyb20gJy4vYWRtaW4uY29udHJvbGxlcic7XHJcbmltcG9ydCB7IGRhc2hib2FyZFN0YXRzU2NoZW1hLCB1c2VyTGlzdFNjaGVtYSwgdXNlclNjaGVtYSwgdXBkYXRlVXNlclNjaGVtYSB9IGZyb20gJy4vYWRtaW4uc2NoZW1hJztcclxuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRtaW5Sb3V0ZXMoZmFzdGlmeTogRmFzdGlmeUluc3RhbmNlKSB7XHJcbiAgZmFzdGlmeS5nZXQoXHJcbiAgICAnL3N0YXRzJyxcclxuICAgIHtcclxuICAgICAgcHJlSGFuZGxlcjogW2Zhc3RpZnkuYXV0aGVudGljYXRlXSxcclxuICAgICAgc2NoZW1hOiB7XHJcbiAgICAgICAgcmVzcG9uc2U6IHtcclxuICAgICAgICAgIDIwMDogZGFzaGJvYXJkU3RhdHNTY2hlbWEsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBnZXREYXNoYm9hcmRTdGF0c0hhbmRsZXJcclxuICApO1xyXG5cclxuICBmYXN0aWZ5LmdldChcclxuICAgICcvdXNlcnMnLFxyXG4gICAge1xyXG4gICAgICBwcmVIYW5kbGVyOiBbZmFzdGlmeS5hdXRoZW50aWNhdGVdLFxyXG4gICAgICBzY2hlbWE6IHtcclxuICAgICAgICByZXNwb25zZToge1xyXG4gICAgICAgICAgMjAwOiB1c2VyTGlzdFNjaGVtYSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGdldFVzZXJzSGFuZGxlclxyXG4gICk7XHJcblxyXG4gIGZhc3RpZnkuZ2V0KFxyXG4gICAgJy91c2Vycy86aWQnLFxyXG4gICAge1xyXG4gICAgICBwcmVIYW5kbGVyOiBbZmFzdGlmeS5hdXRoZW50aWNhdGVdLFxyXG4gICAgICBzY2hlbWE6IHtcclxuICAgICAgICByZXNwb25zZToge1xyXG4gICAgICAgICAgMjAwOiB1c2VyU2NoZW1hLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZ2V0VXNlckhhbmRsZXJcclxuICApO1xyXG5cclxuICBmYXN0aWZ5LnBhdGNoKFxyXG4gICAgJy91c2Vycy86aWQnLFxyXG4gICAge1xyXG4gICAgICBwcmVIYW5kbGVyOiBbZmFzdGlmeS5hdXRoZW50aWNhdGVdLFxyXG4gICAgICBzY2hlbWE6IHtcclxuICAgICAgICBib2R5OiB1cGRhdGVVc2VyU2NoZW1hLFxyXG4gICAgICAgIHJlc3BvbnNlOiB7XHJcbiAgICAgICAgICAyMDA6IHVzZXJTY2hlbWEsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB1cGRhdGVVc2VySGFuZGxlclxyXG4gICk7XHJcblxyXG4gIGZhc3RpZnkuZGVsZXRlKFxyXG4gICAgJy91c2Vycy86aWQnLFxyXG4gICAge1xyXG4gICAgICBwcmVIYW5kbGVyOiBbZmFzdGlmeS5hdXRoZW50aWNhdGVdLFxyXG4gICAgfSxcclxuICAgIGRlbGV0ZVVzZXJIYW5kbGVyXHJcbiAgKTtcclxuXHJcbiAgZmFzdGlmeS5nZXQoXHJcbiAgICAnL3VzZXJzLzppZC9hdWRpdC1sb2dzJyxcclxuICAgIHtcclxuICAgICAgcHJlSGFuZGxlcjogW2Zhc3RpZnkuYXV0aGVudGljYXRlXSxcclxuICAgICAgc2NoZW1hOiB7XHJcbiAgICAgICAgcmVzcG9uc2U6IHtcclxuICAgICAgICAgIDIwMDogei5hcnJheSh6Lm9iamVjdCh7XHJcbiAgICAgICAgICAgIGlkOiB6LnN0cmluZygpLFxyXG4gICAgICAgICAgICBhY3Rpb246IHouc3RyaW5nKCksXHJcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHouZGF0ZSgpLFxyXG4gICAgICAgICAgICBkZXRhaWxzOiB6LmFueSgpLm9wdGlvbmFsKCksXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBnZXRVc2VyQXVkaXRMb2dzSGFuZGxlclxyXG4gICk7XHJcbn1cclxuIl19