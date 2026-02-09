"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wellnessRoutes = wellnessRoutes;
const wellness_schema_1 = require("./wellness.schema");
const wellness_controller_1 = require("./wellness.controller");
const zod_1 = require("zod");
async function wellnessRoutes(app) {
    app.get('/', {
        schema: {
            querystring: zod_1.z.object({
                category: zod_1.z.string().optional(),
            }),
            response: {
                200: zod_1.z.array(wellness_schema_1.wellnessToolResponseSchema),
            },
        },
        preHandler: [app.authenticate],
    }, wellness_controller_1.getWellnessToolsHandler);
    app.get('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            response: {
                200: wellness_schema_1.wellnessToolResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, wellness_controller_1.getWellnessToolByIdHandler);
    // Admin only
    app.post('/', {
        schema: {
            body: wellness_schema_1.createWellnessToolSchema,
            response: {
                201: wellness_schema_1.wellnessToolResponseSchema,
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, wellness_controller_1.createWellnessToolHandler);
    app.patch('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            body: wellness_schema_1.updateWellnessToolSchema,
            response: {
                200: wellness_schema_1.wellnessToolResponseSchema,
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, wellness_controller_1.updateWellnessToolHandler);
    app.delete('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            response: {
                204: zod_1.z.null(),
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, wellness_controller_1.deleteWellnessToolHandler);
    app.post('/:id/progress', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            body: wellness_schema_1.trackProgressSchema,
            response: {
                201: wellness_schema_1.progressResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, wellness_controller_1.trackWellnessProgressHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy93ZWxsbmVzcy93ZWxsbmVzcy5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvd2VsbG5lc3Mvd2VsbG5lc3Mucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esd0NBaUdDO0FBckdELHVEQUFnSztBQUNoSywrREFBMk07QUFDM00sNkJBQXdCO0FBRWpCLEtBQUssVUFBVSxjQUFjLENBQUMsR0FBb0I7SUFDdkQsR0FBRyxDQUFDLEdBQUcsQ0FDTCxHQUFHLEVBQ0g7UUFDRSxNQUFNLEVBQUU7WUFDTixXQUFXLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDcEIsUUFBUSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDaEMsQ0FBQztZQUNGLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyw0Q0FBMEIsQ0FBQzthQUN6QztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELDZDQUF1QixDQUN4QixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxNQUFNLEVBQ047UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDZixFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTthQUNmLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELGdEQUEwQixDQUMzQixDQUFDO0lBRUYsYUFBYTtJQUNiLEdBQUcsQ0FBQyxJQUFJLENBQ04sR0FBRyxFQUNIO1FBQ0UsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLDBDQUF3QjtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCwrQ0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxLQUFLLENBQ1AsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7YUFDZixDQUFDO1lBQ0YsSUFBSSxFQUFFLDBDQUF3QjtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCwrQ0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxNQUFNLENBQ1IsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7YUFDZixDQUFDO1lBQ0YsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFO2FBQ2Q7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQzVFLEVBQ0QsK0NBQXlCLENBQzFCLENBQUM7SUFFRixHQUFHLENBQUMsSUFBSSxDQUNOLGVBQWUsRUFDZjtRQUNFLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEVBQUUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO2FBQ2YsQ0FBQztZQUNGLElBQUksRUFBRSxxQ0FBbUI7WUFDekIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSx3Q0FBc0I7YUFDNUI7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCxrREFBNEIsQ0FDN0IsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IGNyZWF0ZVdlbGxuZXNzVG9vbFNjaGVtYSwgdXBkYXRlV2VsbG5lc3NUb29sU2NoZW1hLCB3ZWxsbmVzc1Rvb2xSZXNwb25zZVNjaGVtYSwgdHJhY2tQcm9ncmVzc1NjaGVtYSwgcHJvZ3Jlc3NSZXNwb25zZVNjaGVtYSB9IGZyb20gJy4vd2VsbG5lc3Muc2NoZW1hJztcbmltcG9ydCB7IGNyZWF0ZVdlbGxuZXNzVG9vbEhhbmRsZXIsIGRlbGV0ZVdlbGxuZXNzVG9vbEhhbmRsZXIsIGdldFdlbGxuZXNzVG9vbEJ5SWRIYW5kbGVyLCBnZXRXZWxsbmVzc1Rvb2xzSGFuZGxlciwgdXBkYXRlV2VsbG5lc3NUb29sSGFuZGxlciwgdHJhY2tXZWxsbmVzc1Byb2dyZXNzSGFuZGxlciB9IGZyb20gJy4vd2VsbG5lc3MuY29udHJvbGxlcic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdlbGxuZXNzUm91dGVzKGFwcDogRmFzdGlmeUluc3RhbmNlKSB7XG4gIGFwcC5nZXQoXG4gICAgJy8nLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBxdWVyeXN0cmluZzogei5vYmplY3Qoe1xuICAgICAgICAgIGNhdGVnb3J5OiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgICAgIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogei5hcnJheSh3ZWxsbmVzc1Rvb2xSZXNwb25zZVNjaGVtYSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZ2V0V2VsbG5lc3NUb29sc0hhbmRsZXJcbiAgKTtcblxuICBhcHAuZ2V0KFxuICAgICcvOmlkJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcGFyYW1zOiB6Lm9iamVjdCh7XG4gICAgICAgICAgaWQ6IHouc3RyaW5nKCksXG4gICAgICAgIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogd2VsbG5lc3NUb29sUmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZ2V0V2VsbG5lc3NUb29sQnlJZEhhbmRsZXJcbiAgKTtcblxuICAvLyBBZG1pbiBvbmx5XG4gIGFwcC5wb3N0KFxuICAgICcvJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgYm9keTogY3JlYXRlV2VsbG5lc3NUb29sU2NoZW1hLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMTogd2VsbG5lc3NUb29sUmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgY3JlYXRlV2VsbG5lc3NUb29sSGFuZGxlclxuICApO1xuXG4gIGFwcC5wYXRjaChcbiAgICAnLzppZCcsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHBhcmFtczogei5vYmplY3Qoe1xuICAgICAgICAgIGlkOiB6LnN0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICAgYm9keTogdXBkYXRlV2VsbG5lc3NUb29sU2NoZW1hLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogd2VsbG5lc3NUb29sUmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgdXBkYXRlV2VsbG5lc3NUb29sSGFuZGxlclxuICApO1xuXG4gIGFwcC5kZWxldGUoXG4gICAgJy86aWQnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHtcbiAgICAgICAgICBpZDogei5zdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjA0OiB6Lm51bGwoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZSwgYXBwLmF1dGhvcml6ZShbJ3N1cGVyX2FkbWluJywgJ29yZ19hZG1pbiddKV0sXG4gICAgfSxcbiAgICBkZWxldGVXZWxsbmVzc1Rvb2xIYW5kbGVyXG4gICk7XG5cbiAgYXBwLnBvc3QoXG4gICAgJy86aWQvcHJvZ3Jlc3MnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHtcbiAgICAgICAgICBpZDogei5zdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgIGJvZHk6IHRyYWNrUHJvZ3Jlc3NTY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAxOiBwcm9ncmVzc1Jlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIHRyYWNrV2VsbG5lc3NQcm9ncmVzc0hhbmRsZXJcbiAgKTtcbn1cbiJdfQ==