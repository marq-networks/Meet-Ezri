"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodRoutes = moodRoutes;
const moods_controller_1 = require("./moods.controller");
const moods_schema_1 = require("./moods.schema");
async function moodRoutes(app) {
    app.post("/", {
        schema: {
            body: moods_schema_1.createMoodSchema,
            tags: ["Moods"],
        },
        preHandler: [app.authenticate],
    }, moods_controller_1.createMoodHandler);
    app.get("/", {
        schema: {
            tags: ["Moods"],
        },
        preHandler: [app.authenticate],
    }, moods_controller_1.getMyMoodsHandler);
    app.get("/admin/users/:userId/moods", {
        schema: {
            tags: ["Moods", "Admin"],
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin', 'team_admin'])],
    }, moods_controller_1.getUserMoodsHandler);
    app.get("/admin", {
        schema: {
            tags: ["Moods", "Admin"],
        },
        preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin', 'team_admin'])],
    }, moods_controller_1.getAllMoodsHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9tb29kcy9tb29kcy5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvbW9vZHMvbW9vZHMucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsZ0NBNkNDO0FBaERELHlEQUFtSDtBQUNuSCxpREFBa0Q7QUFFM0MsS0FBSyxVQUFVLFVBQVUsQ0FBQyxHQUFvQjtJQUNuRCxHQUFHLENBQUMsSUFBSSxDQUNOLEdBQUcsRUFDSDtRQUNFLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSwrQkFBZ0I7WUFDdEIsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO1NBQ2hCO1FBQ0QsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUMvQixFQUNELG9DQUFpQixDQUNsQixDQUFDO0lBRUYsR0FBRyxDQUFDLEdBQUcsQ0FDTCxHQUFHLEVBQ0g7UUFDRSxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDaEI7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQy9CLEVBQ0Qsb0NBQWlCLENBQ2xCLENBQUM7SUFFRixHQUFHLENBQUMsR0FBRyxDQUNMLDRCQUE0QixFQUM1QjtRQUNHLE1BQU0sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FDekI7UUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDMUYsRUFDRCxzQ0FBbUIsQ0FDcEIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxHQUFHLENBQ0wsUUFBUSxFQUNSO1FBQ0csTUFBTSxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztTQUN6QjtRQUNELFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUMxRixFQUNELHFDQUFrQixDQUNuQixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZhc3RpZnlJbnN0YW5jZSB9IGZyb20gXCJmYXN0aWZ5XCI7XHJcbmltcG9ydCB7IGNyZWF0ZU1vb2RIYW5kbGVyLCBnZXRNeU1vb2RzSGFuZGxlciwgZ2V0QWxsTW9vZHNIYW5kbGVyLCBnZXRVc2VyTW9vZHNIYW5kbGVyIH0gZnJvbSBcIi4vbW9vZHMuY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVNb29kU2NoZW1hIH0gZnJvbSBcIi4vbW9vZHMuc2NoZW1hXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbW9vZFJvdXRlcyhhcHA6IEZhc3RpZnlJbnN0YW5jZSkge1xyXG4gIGFwcC5wb3N0KFxyXG4gICAgXCIvXCIsXHJcbiAgICB7XHJcbiAgICAgIHNjaGVtYToge1xyXG4gICAgICAgIGJvZHk6IGNyZWF0ZU1vb2RTY2hlbWEsXHJcbiAgICAgICAgdGFnczogW1wiTW9vZHNcIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcclxuICAgIH0sXHJcbiAgICBjcmVhdGVNb29kSGFuZGxlclxyXG4gICk7XHJcblxyXG4gIGFwcC5nZXQoXHJcbiAgICBcIi9cIixcclxuICAgIHtcclxuICAgICAgc2NoZW1hOiB7XHJcbiAgICAgICAgdGFnczogW1wiTW9vZHNcIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlXSxcclxuICAgIH0sXHJcbiAgICBnZXRNeU1vb2RzSGFuZGxlclxyXG4gICk7XHJcbiAgXHJcbiAgYXBwLmdldChcclxuICAgIFwiL2FkbWluL3VzZXJzLzp1c2VySWQvbW9vZHNcIixcclxuICAgIHtcclxuICAgICAgIHNjaGVtYToge1xyXG4gICAgICAgIHRhZ3M6IFtcIk1vb2RzXCIsIFwiQWRtaW5cIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHByZUhhbmRsZXI6IFthcHAuYXV0aGVudGljYXRlLCBhcHAuYXV0aG9yaXplKFsnc3VwZXJfYWRtaW4nLCAnb3JnX2FkbWluJywgJ3RlYW1fYWRtaW4nXSldLFxyXG4gICAgfSxcclxuICAgIGdldFVzZXJNb29kc0hhbmRsZXJcclxuICApO1xyXG4gIFxyXG4gIGFwcC5nZXQoXHJcbiAgICBcIi9hZG1pblwiLFxyXG4gICAge1xyXG4gICAgICAgc2NoZW1hOiB7XHJcbiAgICAgICAgdGFnczogW1wiTW9vZHNcIiwgXCJBZG1pblwiXSxcclxuICAgICAgfSxcclxuICAgICAgcHJlSGFuZGxlcjogW2FwcC5hdXRoZW50aWNhdGUsIGFwcC5hdXRob3JpemUoWydzdXBlcl9hZG1pbicsICdvcmdfYWRtaW4nLCAndGVhbV9hZG1pbiddKV0sXHJcbiAgICB9LFxyXG4gICAgZ2V0QWxsTW9vZHNIYW5kbGVyXHJcbiAgKTtcclxufVxyXG4iXX0=