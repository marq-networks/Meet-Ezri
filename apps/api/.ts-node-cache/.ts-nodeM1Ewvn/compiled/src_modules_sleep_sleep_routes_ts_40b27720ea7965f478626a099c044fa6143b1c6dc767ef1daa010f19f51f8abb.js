"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepRoutes = sleepRoutes;
const sleep_schema_1 = require("./sleep.schema");
const sleep_controller_1 = require("./sleep.controller");
const zod_1 = require("zod");
async function sleepRoutes(app) {
    app.get('/admin/users/:userId/sleep', {
        schema: {
            params: zod_1.z.object({ userId: zod_1.z.string() }),
            response: {
                200: zod_1.z.array(sleep_schema_1.sleepEntryResponseSchema),
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, sleep_controller_1.getUserSleepEntriesHandler);
    app.get('/', {
        schema: {
            response: {
                200: zod_1.z.array(sleep_schema_1.sleepEntryResponseSchema),
            },
        },
        preHandler: [app.authenticate],
    }, sleep_controller_1.getSleepEntriesHandler);
    app.get('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            response: {
                200: sleep_schema_1.sleepEntryResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, sleep_controller_1.getSleepEntryByIdHandler);
    app.post('/', {
        schema: {
            body: sleep_schema_1.createSleepEntrySchema,
            response: {
                201: sleep_schema_1.sleepEntryResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, sleep_controller_1.createSleepEntryHandler);
    app.patch('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            body: sleep_schema_1.updateSleepEntrySchema,
            response: {
                200: sleep_schema_1.sleepEntryResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, sleep_controller_1.updateSleepEntryHandler);
    app.delete('/:id', {
        schema: {
            params: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            response: {
                204: zod_1.z.null(),
            },
        },
        preHandler: [app.authenticate],
    }, sleep_controller_1.deleteSleepEntryHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9zbGVlcC9zbGVlcC5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvc2xlZXAvc2xlZXAucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esa0NBMEZDO0FBOUZELGlEQUEwRztBQUMxRyx5REFBNkw7QUFDN0wsNkJBQXdCO0FBRWpCLEtBQUssVUFBVSxXQUFXLENBQUMsR0FBb0I7SUFDcEQsR0FBRyxDQUFDLEdBQUcsQ0FDTCw0QkFBNEIsRUFDNUI7UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUN4QyxRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsdUNBQXdCLENBQUM7YUFDdkM7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQzVFLEVBQ0QsNkNBQTBCLENBQzNCLENBQUM7SUFFRixHQUFHLENBQUMsR0FBRyxDQUNMLEdBQUcsRUFDSDtRQUNFLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyx1Q0FBd0IsQ0FBQzthQUN2QztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELHlDQUFzQixDQUN2QixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxNQUFNLEVBQ047UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDZixFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTthQUNmLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHVDQUF3QjthQUM5QjtTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELDJDQUF3QixDQUN6QixDQUFDO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FDTixHQUFHLEVBQ0g7UUFDRSxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUscUNBQXNCO1lBQzVCLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsdUNBQXdCO2FBQzlCO1NBQ0Y7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQy9CLEVBQ0QsMENBQXVCLENBQ3hCLENBQUM7SUFFRixHQUFHLENBQUMsS0FBSyxDQUNQLE1BQU0sRUFDTjtRQUNFLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEVBQUUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO2FBQ2YsQ0FBQztZQUNGLElBQUksRUFBRSxxQ0FBc0I7WUFDNUIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSx1Q0FBd0I7YUFDOUI7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCwwQ0FBdUIsQ0FDeEIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxNQUFNLENBQ1IsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7YUFDZixDQUFDO1lBQ0YsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxPQUFDLENBQUMsSUFBSSxFQUFFO2FBQ2Q7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCwwQ0FBdUIsQ0FDeEIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IGNyZWF0ZVNsZWVwRW50cnlTY2hlbWEsIHVwZGF0ZVNsZWVwRW50cnlTY2hlbWEsIHNsZWVwRW50cnlSZXNwb25zZVNjaGVtYSB9IGZyb20gJy4vc2xlZXAuc2NoZW1hJztcbmltcG9ydCB7IGNyZWF0ZVNsZWVwRW50cnlIYW5kbGVyLCBkZWxldGVTbGVlcEVudHJ5SGFuZGxlciwgZ2V0U2xlZXBFbnRyaWVzSGFuZGxlciwgZ2V0U2xlZXBFbnRyeUJ5SWRIYW5kbGVyLCB1cGRhdGVTbGVlcEVudHJ5SGFuZGxlciwgZ2V0VXNlclNsZWVwRW50cmllc0hhbmRsZXIgfSBmcm9tICcuL3NsZWVwLmNvbnRyb2xsZXInO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzbGVlcFJvdXRlcyhhcHA6IEZhc3RpZnlJbnN0YW5jZSkge1xuICBhcHAuZ2V0KFxuICAgICcvYWRtaW4vdXNlcnMvOnVzZXJJZC9zbGVlcCcsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHBhcmFtczogei5vYmplY3QoeyB1c2VySWQ6IHouc3RyaW5nKCkgfSksXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAwOiB6LmFycmF5KHNsZWVwRW50cnlSZXNwb25zZVNjaGVtYSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgZ2V0VXNlclNsZWVwRW50cmllc0hhbmRsZXJcbiAgKTtcblxuICBhcHAuZ2V0KFxuICAgICcvJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHouYXJyYXkoc2xlZXBFbnRyeVJlc3BvbnNlU2NoZW1hKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBnZXRTbGVlcEVudHJpZXNIYW5kbGVyXG4gICk7XG5cbiAgYXBwLmdldChcbiAgICAnLzppZCcsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHBhcmFtczogei5vYmplY3Qoe1xuICAgICAgICAgIGlkOiB6LnN0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHNsZWVwRW50cnlSZXNwb25zZVNjaGVtYSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBnZXRTbGVlcEVudHJ5QnlJZEhhbmRsZXJcbiAgKTtcblxuICBhcHAucG9zdChcbiAgICAnLycsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIGJvZHk6IGNyZWF0ZVNsZWVwRW50cnlTY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAxOiBzbGVlcEVudHJ5UmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgY3JlYXRlU2xlZXBFbnRyeUhhbmRsZXJcbiAgKTtcblxuICBhcHAucGF0Y2goXG4gICAgJy86aWQnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHtcbiAgICAgICAgICBpZDogei5zdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgIGJvZHk6IHVwZGF0ZVNsZWVwRW50cnlTY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAwOiBzbGVlcEVudHJ5UmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgdXBkYXRlU2xlZXBFbnRyeUhhbmRsZXJcbiAgKTtcblxuICBhcHAuZGVsZXRlKFxuICAgICcvOmlkJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcGFyYW1zOiB6Lm9iamVjdCh7XG4gICAgICAgICAgaWQ6IHouc3RyaW5nKCksXG4gICAgICAgIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwNDogei5udWxsKCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZGVsZXRlU2xlZXBFbnRyeUhhbmRsZXJcbiAgKTtcbn1cbiJdfQ==