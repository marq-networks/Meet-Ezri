"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitsRoutes = habitsRoutes;
const habits_controller_1 = require("./habits.controller");
const habits_schema_1 = require("./habits.schema");
async function habitsRoutes(server) {
    server.get("/admin/users/:userId/habits", {
        preHandler: [server.authenticate, server.authorize(['super_admin', 'org_admin'])],
    }, habits_controller_1.getUserHabitsHandler);
    server.post("/", {
        preHandler: [server.authenticate],
        schema: {
            body: habits_schema_1.createHabitSchema,
            response: {
                201: habits_schema_1.createHabitSchema,
            },
        },
    }, habits_controller_1.createHabitHandler);
    server.get("/", {
        preHandler: [server.authenticate],
    }, habits_controller_1.getHabitsHandler);
    server.put("/:id", {
        preHandler: [server.authenticate],
        schema: {
            body: habits_schema_1.updateHabitSchema,
            response: {
                200: habits_schema_1.updateHabitSchema,
            },
        },
    }, habits_controller_1.updateHabitHandler);
    server.delete("/:id", {
        preHandler: [server.authenticate],
    }, habits_controller_1.deleteHabitHandler);
    server.post("/:id/complete", {
        preHandler: [server.authenticate],
        schema: {
            body: habits_schema_1.logHabitSchema,
        },
    }, habits_controller_1.logHabitCompletionHandler);
    server.delete("/:id/complete", {
        preHandler: [server.authenticate],
    }, habits_controller_1.removeHabitCompletionHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9oYWJpdHMvaGFiaXRzLnJvdXRlcy50cyIsInNvdXJjZXMiOlsiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9oYWJpdHMvaGFiaXRzLnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVlBLG9DQXVFQztBQWxGRCwyREFRNkI7QUFDN0IsbURBQXVGO0FBRWhGLEtBQUssVUFBVSxZQUFZLENBQUMsTUFBdUI7SUFDeEQsTUFBTSxDQUFDLEdBQUcsQ0FDUiw2QkFBNkIsRUFDN0I7UUFDRSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUNsRixFQUNELHdDQUFvQixDQUNyQixDQUFDO0lBRUYsTUFBTSxDQUFDLElBQUksQ0FDVCxHQUFHLEVBQ0g7UUFDRSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ2pDLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxpQ0FBaUI7WUFDdkIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxpQ0FBaUI7YUFDdkI7U0FDRjtLQUNGLEVBQ0Qsc0NBQWtCLENBQ25CLENBQUM7SUFFRixNQUFNLENBQUMsR0FBRyxDQUNSLEdBQUcsRUFDSDtRQUNFLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7S0FDbEMsRUFDRCxvQ0FBZ0IsQ0FDakIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxHQUFHLENBQ1IsTUFBTSxFQUNOO1FBQ0UsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUNqQyxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsaUNBQWlCO1lBQ3ZCLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsaUNBQWlCO2FBQ3ZCO1NBQ0Y7S0FDRixFQUNELHNDQUFrQixDQUNuQixDQUFDO0lBRUYsTUFBTSxDQUFDLE1BQU0sQ0FDWCxNQUFNLEVBQ047UUFDRSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO0tBQ2xDLEVBQ0Qsc0NBQWtCLENBQ25CLENBQUM7SUFFRixNQUFNLENBQUMsSUFBSSxDQUNULGVBQWUsRUFDZjtRQUNFLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDakMsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLDhCQUFjO1NBQ3JCO0tBQ0YsRUFDRCw2Q0FBeUIsQ0FDMUIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxNQUFNLENBQ1gsZUFBZSxFQUNmO1FBQ0UsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztLQUNsQyxFQUNELGdEQUE0QixDQUM3QixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZhc3RpZnlJbnN0YW5jZSB9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge1xuICBjcmVhdGVIYWJpdEhhbmRsZXIsXG4gIGdldEhhYml0c0hhbmRsZXIsXG4gIHVwZGF0ZUhhYml0SGFuZGxlcixcbiAgZGVsZXRlSGFiaXRIYW5kbGVyLFxuICBsb2dIYWJpdENvbXBsZXRpb25IYW5kbGVyLFxuICByZW1vdmVIYWJpdENvbXBsZXRpb25IYW5kbGVyLFxuICBnZXRVc2VySGFiaXRzSGFuZGxlclxufSBmcm9tIFwiLi9oYWJpdHMuY29udHJvbGxlclwiO1xuaW1wb3J0IHsgY3JlYXRlSGFiaXRTY2hlbWEsIHVwZGF0ZUhhYml0U2NoZW1hLCBsb2dIYWJpdFNjaGVtYSB9IGZyb20gXCIuL2hhYml0cy5zY2hlbWFcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhYml0c1JvdXRlcyhzZXJ2ZXI6IEZhc3RpZnlJbnN0YW5jZSkge1xuICBzZXJ2ZXIuZ2V0KFxuICAgIFwiL2FkbWluL3VzZXJzLzp1c2VySWQvaGFiaXRzXCIsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW3NlcnZlci5hdXRoZW50aWNhdGUsIHNlcnZlci5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nXSldLFxuICAgIH0sXG4gICAgZ2V0VXNlckhhYml0c0hhbmRsZXJcbiAgKTtcblxuICBzZXJ2ZXIucG9zdChcbiAgICBcIi9cIixcbiAgICB7XG4gICAgICBwcmVIYW5kbGVyOiBbc2VydmVyLmF1dGhlbnRpY2F0ZV0sXG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgYm9keTogY3JlYXRlSGFiaXRTY2hlbWEsXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgMjAxOiBjcmVhdGVIYWJpdFNjaGVtYSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjcmVhdGVIYWJpdEhhbmRsZXJcbiAgKTtcblxuICBzZXJ2ZXIuZ2V0KFxuICAgIFwiL1wiLFxuICAgIHtcbiAgICAgIHByZUhhbmRsZXI6IFtzZXJ2ZXIuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIGdldEhhYml0c0hhbmRsZXJcbiAgKTtcblxuICBzZXJ2ZXIucHV0KFxuICAgIFwiLzppZFwiLFxuICAgIHtcbiAgICAgIHByZUhhbmRsZXI6IFtzZXJ2ZXIuYXV0aGVudGljYXRlXSxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBib2R5OiB1cGRhdGVIYWJpdFNjaGVtYSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAyMDA6IHVwZGF0ZUhhYml0U2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZUhhYml0SGFuZGxlclxuICApO1xuXG4gIHNlcnZlci5kZWxldGUoXG4gICAgXCIvOmlkXCIsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW3NlcnZlci5hdXRoZW50aWNhdGVdLFxuICAgIH0sXG4gICAgZGVsZXRlSGFiaXRIYW5kbGVyXG4gICk7XG5cbiAgc2VydmVyLnBvc3QoXG4gICAgXCIvOmlkL2NvbXBsZXRlXCIsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW3NlcnZlci5hdXRoZW50aWNhdGVdLFxuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIGJvZHk6IGxvZ0hhYml0U2NoZW1hLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGxvZ0hhYml0Q29tcGxldGlvbkhhbmRsZXJcbiAgKTtcblxuICBzZXJ2ZXIuZGVsZXRlKFxuICAgIFwiLzppZC9jb21wbGV0ZVwiLFxuICAgIHtcbiAgICAgIHByZUhhbmRsZXI6IFtzZXJ2ZXIuYXV0aGVudGljYXRlXSxcbiAgICB9LFxuICAgIHJlbW92ZUhhYml0Q29tcGxldGlvbkhhbmRsZXJcbiAgKTtcbn1cbiJdfQ==