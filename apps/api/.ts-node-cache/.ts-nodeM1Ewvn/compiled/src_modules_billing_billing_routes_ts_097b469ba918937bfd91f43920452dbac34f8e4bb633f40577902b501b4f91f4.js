"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingRoutes = billingRoutes;
const billing_schema_1 = require("./billing.schema");
const billing_controller_1 = require("./billing.controller");
const zod_1 = require("zod");
async function billingRoutes(app) {
    app.get('/', {
        schema: {
            response: {
                200: billing_schema_1.subscriptionResponseSchema.extend({
                    id: zod_1.z.string().optional(),
                    user_id: zod_1.z.string().optional(),
                    created_at: zod_1.z.date().optional(),
                    updated_at: zod_1.z.date().optional()
                }),
            },
        },
        preHandler: [app.authenticate],
    }, billing_controller_1.getSubscriptionHandler);
    app.post('/', {
        schema: {
            body: billing_schema_1.createSubscriptionSchema,
            response: {
                201: billing_schema_1.subscriptionResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, billing_controller_1.createSubscriptionHandler);
    app.patch('/', {
        schema: {
            body: billing_schema_1.updateSubscriptionSchema,
            response: {
                200: billing_schema_1.subscriptionResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, billing_controller_1.updateSubscriptionHandler);
    app.post('/cancel', {
        schema: {
            response: {
                200: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
        preHandler: [app.authenticate],
    }, billing_controller_1.cancelSubscriptionHandler);
    app.get('/history', {
        schema: {
            response: {
                200: zod_1.z.array(billing_schema_1.subscriptionResponseSchema),
            },
        },
        preHandler: [app.authenticate],
    }, billing_controller_1.getBillingHistoryHandler);
    app.get('/admin/subscriptions', {
        schema: {
            response: {
                200: zod_1.z.array(billing_schema_1.subscriptionResponseSchema.extend({
                    id: zod_1.z.string().optional(),
                    user_id: zod_1.z.string().optional(),
                    created_at: zod_1.z.date().optional(),
                    updated_at: zod_1.z.date().optional(),
                    users: zod_1.z.object({
                        email: zod_1.z.string().optional(),
                        profiles: zod_1.z.object({
                            full_name: zod_1.z.string().nullable().optional(),
                        }).nullable().optional()
                    }).optional()
                })),
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, billing_controller_1.getAllSubscriptionsHandler);
    app.get('/admin/users/:userId/subscription', {
        schema: {
            params: zod_1.z.object({ userId: zod_1.z.string() }),
            response: {
                200: billing_schema_1.subscriptionResponseSchema.extend({
                    id: zod_1.z.string().optional(),
                    user_id: zod_1.z.string().optional(),
                    created_at: zod_1.z.date().optional(),
                    updated_at: zod_1.z.date().optional()
                }),
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, billing_controller_1.getSubscriptionByUserIdHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9iaWxsaW5nL2JpbGxpbmcucm91dGVzLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL2JpbGxpbmcvYmlsbGluZy5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzQ0FtSEM7QUF2SEQscURBQWtIO0FBQ2xILDZEQUFxUTtBQUNyUSw2QkFBd0I7QUFFakIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFvQjtJQUN0RCxHQUFHLENBQUMsR0FBRyxDQUNMLEdBQUcsRUFDSDtRQUNFLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsMkNBQTBCLENBQUMsTUFBTSxDQUFDO29CQUNuQyxFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDekIsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7b0JBQzlCLFVBQVUsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUMvQixVQUFVLEVBQUUsT0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtpQkFDbEMsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQy9CLEVBQ0QsMkNBQXNCLENBQ3ZCLENBQUM7SUFFRixHQUFHLENBQUMsSUFBSSxDQUNOLEdBQUcsRUFDSDtRQUNFLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSx5Q0FBd0I7WUFDOUIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSwyQ0FBMEI7YUFDaEM7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCw4Q0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxLQUFLLENBQ1AsR0FBRyxFQUNIO1FBQ0UsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLHlDQUF3QjtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDJDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELDhDQUF5QixDQUMxQixDQUFDO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FDTixTQUFTLEVBQ1Q7UUFDRSxNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7YUFDdkM7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCw4Q0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxHQUFHLENBQ0wsVUFBVSxFQUNWO1FBQ0UsTUFBTSxFQUFFO1lBQ04sUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLDJDQUEwQixDQUFDO2FBQ3pDO1NBQ0Y7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQy9CLEVBQ0QsNkNBQXdCLENBQ3pCLENBQUM7SUFFRixHQUFHLENBQUMsR0FBRyxDQUNMLHNCQUFzQixFQUN0QjtRQUNFLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQywyQ0FBMEIsQ0FBQyxNQUFNLENBQUM7b0JBQzdDLEVBQUUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUN6QixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDOUIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7b0JBQy9CLFVBQVUsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUMvQixLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDZCxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTt3QkFDNUIsUUFBUSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7NEJBQ2pCLFNBQVMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO3lCQUM1QyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO3FCQUN6QixDQUFDLENBQUMsUUFBUSxFQUFFO2lCQUNkLENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUM1RSxFQUNELCtDQUEwQixDQUMzQixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxtQ0FBbUMsRUFDbkM7UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUN4QyxRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDJDQUEwQixDQUFDLE1BQU0sQ0FBQztvQkFDbkMsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7b0JBQ3pCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUM5QixVQUFVLEVBQUUsT0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDL0IsVUFBVSxFQUFFLE9BQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7aUJBQ2xDLENBQUM7YUFDSDtTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCxtREFBOEIsQ0FDL0IsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IGNyZWF0ZVN1YnNjcmlwdGlvblNjaGVtYSwgc3Vic2NyaXB0aW9uUmVzcG9uc2VTY2hlbWEsIHVwZGF0ZVN1YnNjcmlwdGlvblNjaGVtYSB9IGZyb20gJy4vYmlsbGluZy5zY2hlbWEnO1xuaW1wb3J0IHsgY2FuY2VsU3Vic2NyaXB0aW9uSGFuZGxlciwgY3JlYXRlU3Vic2NyaXB0aW9uSGFuZGxlciwgZ2V0QmlsbGluZ0hpc3RvcnlIYW5kbGVyLCBnZXRTdWJzY3JpcHRpb25IYW5kbGVyLCB1cGRhdGVTdWJzY3JpcHRpb25IYW5kbGVyLCBnZXRBbGxTdWJzY3JpcHRpb25zSGFuZGxlciwgYWRtaW5VcGRhdGVTdWJzY3JpcHRpb25IYW5kbGVyLCBnZXRTdWJzY3JpcHRpb25CeVVzZXJJZEhhbmRsZXIgfSBmcm9tICcuL2JpbGxpbmcuY29udHJvbGxlcic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJpbGxpbmdSb3V0ZXMoYXBwOiBGYXN0aWZ5SW5zdGFuY2UpIHtcbiAgYXBwLmdldChcbiAgICAnLycsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAwOiBzdWJzY3JpcHRpb25SZXNwb25zZVNjaGVtYS5leHRlbmQoe1xuICAgICAgICAgICAgICBpZDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgICB1c2VyX2lkOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHouZGF0ZSgpLm9wdGlvbmFsKCksXG4gICAgICAgICAgICAgIHVwZGF0ZWRfYXQ6IHouZGF0ZSgpLm9wdGlvbmFsKClcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBnZXRTdWJzY3JpcHRpb25IYW5kbGVyXG4gICk7XG5cbiAgYXBwLnBvc3QoXG4gICAgJy8nLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBib2R5OiBjcmVhdGVTdWJzY3JpcHRpb25TY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAxOiBzdWJzY3JpcHRpb25SZXNwb25zZVNjaGVtYSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBjcmVhdGVTdWJzY3JpcHRpb25IYW5kbGVyXG4gICk7XG5cbiAgYXBwLnBhdGNoKFxuICAgICcvJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgYm9keTogdXBkYXRlU3Vic2NyaXB0aW9uU2NoZW1hLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogc3Vic2NyaXB0aW9uUmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgdXBkYXRlU3Vic2NyaXB0aW9uSGFuZGxlclxuICApO1xuXG4gIGFwcC5wb3N0KFxuICAgICcvY2FuY2VsJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHoub2JqZWN0KHsgbWVzc2FnZTogei5zdHJpbmcoKSB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBjYW5jZWxTdWJzY3JpcHRpb25IYW5kbGVyXG4gICk7XG5cbiAgYXBwLmdldChcbiAgICAnL2hpc3RvcnknLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogei5hcnJheShzdWJzY3JpcHRpb25SZXNwb25zZVNjaGVtYSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZ2V0QmlsbGluZ0hpc3RvcnlIYW5kbGVyXG4gICk7XG5cbiAgYXBwLmdldChcbiAgICAnL2FkbWluL3N1YnNjcmlwdGlvbnMnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogei5hcnJheShzdWJzY3JpcHRpb25SZXNwb25zZVNjaGVtYS5leHRlbmQoe1xuICAgICAgICAgICAgaWQ6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgICAgICAgIHVzZXJfaWQ6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHouZGF0ZSgpLm9wdGlvbmFsKCksXG4gICAgICAgICAgICB1cGRhdGVkX2F0OiB6LmRhdGUoKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgdXNlcnM6IHoub2JqZWN0KHtcbiAgICAgICAgICAgICAgZW1haWw6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgICAgICAgICAgcHJvZmlsZXM6IHoub2JqZWN0KHtcbiAgICAgICAgICAgICAgICBmdWxsX25hbWU6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgICB9KS5udWxsYWJsZSgpLm9wdGlvbmFsKClcbiAgICAgICAgICAgIH0pLm9wdGlvbmFsKClcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgZ2V0QWxsU3Vic2NyaXB0aW9uc0hhbmRsZXJcbiAgKTtcblxuICBhcHAuZ2V0KFxuICAgICcvYWRtaW4vdXNlcnMvOnVzZXJJZC9zdWJzY3JpcHRpb24nLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHsgdXNlcklkOiB6LnN0cmluZygpIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogc3Vic2NyaXB0aW9uUmVzcG9uc2VTY2hlbWEuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgaWQ6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgICAgICAgICAgdXNlcl9pZDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiB6LmRhdGUoKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgICB1cGRhdGVkX2F0OiB6LmRhdGUoKS5vcHRpb25hbCgpXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgZ2V0U3Vic2NyaXB0aW9uQnlVc2VySWRIYW5kbGVyXG4gICk7XG59XG4iXX0=