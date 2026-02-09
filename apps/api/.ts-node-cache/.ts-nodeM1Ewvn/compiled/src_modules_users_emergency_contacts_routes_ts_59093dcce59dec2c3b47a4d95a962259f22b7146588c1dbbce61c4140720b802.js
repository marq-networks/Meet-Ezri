"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyContactRoutes = emergencyContactRoutes;
const emergency_contacts_controller_1 = require("./emergency-contacts.controller");
const emergency_contacts_schema_1 = require("./emergency-contacts.schema");
const zod_1 = require("zod");
async function emergencyContactRoutes(fastify) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            response: {
                200: zod_1.z.array(emergency_contacts_schema_1.emergencyContactResponseSchema),
            },
        },
    }, emergency_contacts_controller_1.getContactsHandler);
    fastify.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            body: emergency_contacts_schema_1.createEmergencyContactSchema,
            response: {
                201: emergency_contacts_schema_1.emergencyContactResponseSchema,
            },
        },
    }, emergency_contacts_controller_1.createContactHandler);
    fastify.patch('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
            body: emergency_contacts_schema_1.updateEmergencyContactSchema,
            response: {
                200: emergency_contacts_schema_1.emergencyContactResponseSchema,
            },
        },
    }, emergency_contacts_controller_1.updateContactHandler);
    fastify.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
        },
    }, emergency_contacts_controller_1.deleteContactHandler);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy91c2Vycy9lbWVyZ2VuY3ktY29udGFjdHMucm91dGVzLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL3VzZXJzL2VtZXJnZW5jeS1jb250YWN0cy5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSx3REFxREM7QUE5REQsbUZBS3lDO0FBQ3pDLDJFQUF5STtBQUN6SSw2QkFBd0I7QUFFakIsS0FBSyxVQUFVLHNCQUFzQixDQUFDLE9BQXdCO0lBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQ1QsR0FBRyxFQUNIO1FBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNsQyxNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsMERBQThCLENBQUM7YUFDN0M7U0FDRjtLQUNGLEVBQ0Qsa0RBQWtCLENBQ25CLENBQUM7SUFFRixPQUFPLENBQUMsSUFBSSxDQUNWLEdBQUcsRUFDSDtRQUNFLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDbEMsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLHdEQUE0QjtZQUNsQyxRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLDBEQUE4QjthQUNwQztTQUNGO0tBQ0YsRUFDRCxvREFBb0IsQ0FDckIsQ0FBQztJQUVGLE9BQU8sQ0FBQyxLQUFLLENBQ1gsTUFBTSxFQUNOO1FBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNsQyxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMzQyxJQUFJLEVBQUUsd0RBQTRCO1lBQ2xDLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsMERBQThCO2FBQ3BDO1NBQ0Y7S0FDRixFQUNELG9EQUFvQixDQUNyQixDQUFDO0lBRUYsT0FBTyxDQUFDLE1BQU0sQ0FDWixNQUFNLEVBQ047UUFDRSxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ2xDLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1NBQzVDO0tBQ0YsRUFDRCxvREFBb0IsQ0FDckIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7XG4gIGdldENvbnRhY3RzSGFuZGxlcixcbiAgY3JlYXRlQ29udGFjdEhhbmRsZXIsXG4gIHVwZGF0ZUNvbnRhY3RIYW5kbGVyLFxuICBkZWxldGVDb250YWN0SGFuZGxlcixcbn0gZnJvbSAnLi9lbWVyZ2VuY3ktY29udGFjdHMuY29udHJvbGxlcic7XG5pbXBvcnQgeyBjcmVhdGVFbWVyZ2VuY3lDb250YWN0U2NoZW1hLCB1cGRhdGVFbWVyZ2VuY3lDb250YWN0U2NoZW1hLCBlbWVyZ2VuY3lDb250YWN0UmVzcG9uc2VTY2hlbWEgfSBmcm9tICcuL2VtZXJnZW5jeS1jb250YWN0cy5zY2hlbWEnO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbWVyZ2VuY3lDb250YWN0Um91dGVzKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkge1xuICBmYXN0aWZ5LmdldChcbiAgICAnLycsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW2Zhc3RpZnkuYXV0aGVudGljYXRlXSxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogei5hcnJheShlbWVyZ2VuY3lDb250YWN0UmVzcG9uc2VTY2hlbWEpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGdldENvbnRhY3RzSGFuZGxlclxuICApO1xuXG4gIGZhc3RpZnkucG9zdChcbiAgICAnLycsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW2Zhc3RpZnkuYXV0aGVudGljYXRlXSxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBib2R5OiBjcmVhdGVFbWVyZ2VuY3lDb250YWN0U2NoZW1hLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMTogZW1lcmdlbmN5Q29udGFjdFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNyZWF0ZUNvbnRhY3RIYW5kbGVyXG4gICk7XG5cbiAgZmFzdGlmeS5wYXRjaChcbiAgICAnLzppZCcsXG4gICAge1xuICAgICAgcHJlSGFuZGxlcjogW2Zhc3RpZnkuYXV0aGVudGljYXRlXSxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBwYXJhbXM6IHoub2JqZWN0KHsgaWQ6IHouc3RyaW5nKCkudXVpZCgpIH0pLFxuICAgICAgICBib2R5OiB1cGRhdGVFbWVyZ2VuY3lDb250YWN0U2NoZW1hLFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgIDIwMDogZW1lcmdlbmN5Q29udGFjdFJlc3BvbnNlU2NoZW1hLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRhY3RIYW5kbGVyXG4gICk7XG5cbiAgZmFzdGlmeS5kZWxldGUoXG4gICAgJy86aWQnLFxuICAgIHtcbiAgICAgIHByZUhhbmRsZXI6IFtmYXN0aWZ5LmF1dGhlbnRpY2F0ZV0sXG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgcGFyYW1zOiB6Lm9iamVjdCh7IGlkOiB6LnN0cmluZygpLnV1aWQoKSB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWxldGVDb250YWN0SGFuZGxlclxuICApO1xufVxuIl19