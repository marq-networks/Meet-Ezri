"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalRoutes = journalRoutes;
const journal_schema_1 = require("./journal.schema");
const journal_controller_1 = require("./journal.controller");
const zod_1 = require("zod");
async function journalRoutes(app) {
    app.get('/admin/users/:userId/journals', {
        schema: {
            params: zod_1.z.object({ userId: zod_1.z.string() }),
            response: {
                200: zod_1.z.array(journal_schema_1.journalResponseSchema),
            },
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    }, journal_controller_1.getUserJournalsHandler);
    app.post('/', {
        schema: {
            body: journal_schema_1.createJournalSchema,
            response: {
                201: journal_schema_1.journalResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, journal_controller_1.createJournalHandler);
    app.get('/', {
        schema: {
            response: {
                200: zod_1.z.array(journal_schema_1.journalResponseSchema),
            },
        },
        preHandler: [app.authenticate],
    }, journal_controller_1.getJournalsHandler);
    app.get('/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string() }),
            response: {
                200: journal_schema_1.journalResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, journal_controller_1.getJournalByIdHandler);
    app.patch('/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string() }),
            body: journal_schema_1.updateJournalSchema,
            response: {
                200: journal_schema_1.journalResponseSchema,
            },
        },
        preHandler: [app.authenticate],
    }, journal_controller_1.updateJournalHandler);
    app.delete('/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string() }),
        },
        preHandler: [app.authenticate],
    }, journal_controller_1.deleteJournalHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9qb3VybmFsL2pvdXJuYWwucm91dGVzLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL2pvdXJuYWwvam91cm5hbC5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzQ0FpRkM7QUFyRkQscURBQW1HO0FBQ25HLDZEQUEySztBQUMzSyw2QkFBd0I7QUFFakIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFvQjtJQUN0RCxHQUFHLENBQUMsR0FBRyxDQUNMLCtCQUErQixFQUMvQjtRQUNFLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxzQ0FBcUIsQ0FBQzthQUNwQztTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsRUFDRCwyQ0FBc0IsQ0FDdkIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQ04sR0FBRyxFQUNIO1FBQ0UsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLG9DQUFtQjtZQUN6QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHNDQUFxQjthQUMzQjtTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELHlDQUFvQixDQUNyQixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxHQUFHLEVBQ0g7UUFDRSxNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsc0NBQXFCLENBQUM7YUFDcEM7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCx1Q0FBa0IsQ0FDbkIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxHQUFHLENBQ0wsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7WUFDcEMsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxzQ0FBcUI7YUFDM0I7U0FDRjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCwwQ0FBcUIsQ0FDdEIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxLQUFLLENBQ1AsTUFBTSxFQUNOO1FBQ0UsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7WUFDcEMsSUFBSSxFQUFFLG9DQUFtQjtZQUN6QixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHNDQUFxQjthQUMzQjtTQUNGO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELHlDQUFvQixDQUNyQixDQUFDO0lBRUYsR0FBRyxDQUFDLE1BQU0sQ0FDUixNQUFNLEVBQ047UUFDRSxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztTQUNyQztRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDL0IsRUFDRCx5Q0FBb0IsQ0FDckIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IGNyZWF0ZUpvdXJuYWxTY2hlbWEsIGpvdXJuYWxSZXNwb25zZVNjaGVtYSwgdXBkYXRlSm91cm5hbFNjaGVtYSB9IGZyb20gJy4vam91cm5hbC5zY2hlbWEnO1xuaW1wb3J0IHsgY3JlYXRlSm91cm5hbEhhbmRsZXIsIGRlbGV0ZUpvdXJuYWxIYW5kbGVyLCBnZXRKb3VybmFsQnlJZEhhbmRsZXIsIGdldEpvdXJuYWxzSGFuZGxlciwgdXBkYXRlSm91cm5hbEhhbmRsZXIsIGdldFVzZXJKb3VybmFsc0hhbmRsZXIgfSBmcm9tICcuL2pvdXJuYWwuY29udHJvbGxlcic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGpvdXJuYWxSb3V0ZXMoYXBwOiBGYXN0aWZ5SW5zdGFuY2UpIHtcbiAgYXBwLmdldChcbiAgICAnL2FkbWluL3VzZXJzLzp1c2VySWQvam91cm5hbHMnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHsgdXNlcklkOiB6LnN0cmluZygpIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogei5hcnJheShqb3VybmFsUmVzcG9uc2VTY2hlbWEpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlLCBhcHAuYXV0aG9yaXplKFsnc3VwZXJfYWRtaW4nLCAnb3JnX2FkbWluJ10pXSxcbiAgICB9LFxuICAgIGdldFVzZXJKb3VybmFsc0hhbmRsZXJcbiAgKTtcblxuICBhcHAucG9zdChcbiAgICAnLycsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIGJvZHk6IGNyZWF0ZUpvdXJuYWxTY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAxOiBqb3VybmFsUmVzcG9uc2VTY2hlbWEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgY3JlYXRlSm91cm5hbEhhbmRsZXJcbiAgKTtcblxuICBhcHAuZ2V0KFxuICAgICcvJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHouYXJyYXkoam91cm5hbFJlc3BvbnNlU2NoZW1hKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICBnZXRKb3VybmFsc0hhbmRsZXJcbiAgKTtcblxuICBhcHAuZ2V0KFxuICAgICcvOmlkJyxcbiAgICB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcGFyYW1zOiB6Lm9iamVjdCh7IGlkOiB6LnN0cmluZygpIH0pLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogam91cm5hbFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIGdldEpvdXJuYWxCeUlkSGFuZGxlclxuICApO1xuXG4gIGFwcC5wYXRjaChcbiAgICAnLzppZCcsXG4gICAge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHBhcmFtczogei5vYmplY3QoeyBpZDogei5zdHJpbmcoKSB9KSxcbiAgICAgICAgYm9keTogdXBkYXRlSm91cm5hbFNjaGVtYSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IGpvdXJuYWxSZXNwb25zZVNjaGVtYSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVIYW5kbGVyOiBbYXBwLmF1dGhlbnRpY2F0ZV0sXG4gICAgfSxcbiAgICB1cGRhdGVKb3VybmFsSGFuZGxlclxuICApO1xuXG4gIGFwcC5kZWxldGUoXG4gICAgJy86aWQnLFxuICAgIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHsgaWQ6IHouc3RyaW5nKCkgfSksXG4gICAgICB9LFxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZGVsZXRlSm91cm5hbEhhbmRsZXJcbiAgKTtcbn1cbiJdfQ==