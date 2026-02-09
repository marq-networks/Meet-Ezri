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
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy93ZWxsbmVzcy93ZWxsbmVzcy5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvd2VsbG5lc3Mvd2VsbG5lc3Mucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esd0NBZ0ZDO0FBcEZELHVEQUFtSDtBQUNuSCwrREFBNks7QUFDN0ssNkJBQXdCO0FBRWpCLEtBQUssVUFBVSxjQUFjLENBQUMsR0FBb0I7SUFDdkQsR0FBRyxDQUFDLEdBQUcsQ0FDTCxHQUFHLEVBQ0g7UUFDRSxNQUFNLEVBQUU7WUFDTixXQUFXLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDcEIsUUFBUSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDaEMsQ0FBQztZQUNGLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyw0Q0FBMEIsQ0FBQzthQUN6QztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELDZDQUF1QixDQUN4QixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxNQUFNLEVBQ047UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDZixFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTthQUNmLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELGdEQUEwQixDQUMzQixDQUFDO0lBRUYsYUFBYTtJQUNiLEdBQUcsQ0FBQyxJQUFJLENBQ04sR0FBRyxFQUNIO1FBQ0UsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLDBDQUF3QjtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCwrQ0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxLQUFLLENBQ1AsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7YUFDZixDQUFDO1lBQ0YsSUFBSSxFQUFFLDBDQUF3QjtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDRDQUEwQjthQUNoQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCwrQ0FBeUIsQ0FDMUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxNQUFNLENBQ1IsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7YUFDZixDQUFDO1lBQ0YsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFO2FBQ2Q7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQzVFLEVBQ0QsK0NBQXlCLENBQzFCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmFzdGlmeUluc3RhbmNlIH0gZnJvbSAnZmFzdGlmeSc7XG5pbXBvcnQgeyBjcmVhdGVXZWxsbmVzc1Rvb2xTY2hlbWEsIHVwZGF0ZVdlbGxuZXNzVG9vbFNjaGVtYSwgd2VsbG5lc3NUb29sUmVzcG9uc2VTY2hlbWEgfSBmcm9tICcuL3dlbGxuZXNzLnNjaGVtYSc7XG5pbXBvcnQgeyBjcmVhdGVXZWxsbmVzc1Rvb2xIYW5kbGVyLCBkZWxldGVXZWxsbmVzc1Rvb2xIYW5kbGVyLCBnZXRXZWxsbmVzc1Rvb2xCeUlkSGFuZGxlciwgZ2V0V2VsbG5lc3NUb29sc0hhbmRsZXIsIHVwZGF0ZVdlbGxuZXNzVG9vbEhhbmRsZXIgfSBmcm9tICcuL3dlbGxuZXNzLmNvbnRyb2xsZXInO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3ZWxsbmVzc1JvdXRlcyhhcHA6IEZhc3RpZnlJbnN0YW5jZSkge1xuICBhcHAuZ2V0KFxuICAgICcvJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcXVlcnlzdHJpbmc6IHoub2JqZWN0KHtcbiAgICAgICAgICBjYXRlZ29yeTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHouYXJyYXkod2VsbG5lc3NUb29sUmVzcG9uc2VTY2hlbWEpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIGdldFdlbGxuZXNzVG9vbHNIYW5kbGVyXG4gICk7XG5cbiAgYXBwLmdldChcbiAgICAnLzppZCcsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHBhcmFtczogei5vYmplY3Qoe1xuICAgICAgICAgIGlkOiB6LnN0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHdlbGxuZXNzVG9vbFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIGdldFdlbGxuZXNzVG9vbEJ5SWRIYW5kbGVyXG4gICk7XG5cbiAgLy8gQWRtaW4gb25seVxuICBhcHAucG9zdChcbiAgICAnLycsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIGJvZHk6IGNyZWF0ZVdlbGxuZXNzVG9vbFNjaGVtYSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDE6IHdlbGxuZXNzVG9vbFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlLCBhcHAuYXV0aG9yaXplKFsnc3VwZXJfYWRtaW4nLCAnb3JnX2FkbWluJ10pXSxcbiAgICB9LFxuICAgIGNyZWF0ZVdlbGxuZXNzVG9vbEhhbmRsZXJcbiAgKTtcblxuICBhcHAucGF0Y2goXG4gICAgJy86aWQnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHtcbiAgICAgICAgICBpZDogei5zdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgIGJvZHk6IHVwZGF0ZVdlbGxuZXNzVG9vbFNjaGVtYSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHdlbGxuZXNzVG9vbFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlLCBhcHAuYXV0aG9yaXplKFsnc3VwZXJfYWRtaW4nLCAnb3JnX2FkbWluJ10pXSxcbiAgICB9LFxuICAgIHVwZGF0ZVdlbGxuZXNzVG9vbEhhbmRsZXJcbiAgKTtcblxuICBhcHAuZGVsZXRlKFxuICAgICcvOmlkJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcGFyYW1zOiB6Lm9iamVjdCh7XG4gICAgICAgICAgaWQ6IHouc3RyaW5nKCksXG4gICAgICAgIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwNDogei5udWxsKCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgZGVsZXRlV2VsbG5lc3NUb29sSGFuZGxlclxuICApO1xufVxuIl19