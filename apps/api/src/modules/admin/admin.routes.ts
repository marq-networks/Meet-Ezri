
import { FastifyInstance } from 'fastify';
import { 
  getDashboardStatsHandler, getUsersHandler, getUserHandler, updateUserHandler, deleteUserHandler, getUserAuditLogsHandler, getRecentActivityHandler,
  getUserSegmentsHandler, createUserSegmentHandler, deleteUserSegmentHandler,
  getManualNotificationsHandler, createManualNotificationHandler, getNotificationAudienceCountsHandler,
  getEmailTemplatesHandler, createEmailTemplateHandler, updateEmailTemplateHandler, deleteEmailTemplateHandler,
  getPushCampaignsHandler, createPushCampaignHandler,
  getSupportTicketsHandler, updateSupportTicketHandler,
  getCommunityStatsHandler, getCommunityGroupsHandler,
  getLiveSessionsHandler, getActivityLogsHandler, getSessionRecordingsHandler, getErrorLogsHandler
} from './admin.controller';
import { dashboardStatsSchema, userListSchema, userSchema, updateUserSchema } from './admin.schema';
import { z } from 'zod';

export async function adminRoutes(fastify: FastifyInstance) {
  // Stats & Dashboard
  fastify.get(
    '/stats',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: dashboardStatsSchema,
        },
      },
    },
    getDashboardStatsHandler
  );

  fastify.get(
    '/stats/recent',
    {
      preHandler: [fastify.authenticate],
    },
    getRecentActivityHandler
  );

  // User Management
  fastify.get(
    '/users',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: userListSchema,
        },
      },
    },
    getUsersHandler
  );

  fastify.get(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: userSchema,
        },
      },
    },
    getUserHandler
  );

  fastify.patch(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: updateUserSchema,
        response: {
          200: userSchema,
        },
      },
    },
    updateUserHandler
  );

  fastify.delete(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
    },
    deleteUserHandler
  );

  fastify.get(
    '/users/:id/audit-logs',
    {
      preHandler: [fastify.authenticate],
    },
    getUserAuditLogsHandler
  );

  // User Segmentation
  fastify.get('/user-segments', { preHandler: [fastify.authenticate] }, getUserSegmentsHandler);
  fastify.post('/user-segments', { preHandler: [fastify.authenticate] }, createUserSegmentHandler);
  fastify.delete('/user-segments/:id', { preHandler: [fastify.authenticate] }, deleteUserSegmentHandler);

  // Notifications
  fastify.get('/notifications/manual', { preHandler: [fastify.authenticate] }, getManualNotificationsHandler);
  fastify.post('/notifications/manual', { preHandler: [fastify.authenticate] }, createManualNotificationHandler);
  fastify.get('/notifications/audience-counts', { preHandler: [fastify.authenticate] }, getNotificationAudienceCountsHandler);

  // Email Templates
  fastify.get('/email-templates', { preHandler: [fastify.authenticate] }, getEmailTemplatesHandler);
  fastify.post('/email-templates', { preHandler: [fastify.authenticate] }, createEmailTemplateHandler);
  fastify.put('/email-templates/:id', { preHandler: [fastify.authenticate] }, updateEmailTemplateHandler);
  fastify.delete('/email-templates/:id', { preHandler: [fastify.authenticate] }, deleteEmailTemplateHandler);

  // Push Campaigns
  fastify.get('/push-campaigns', { preHandler: [fastify.authenticate] }, getPushCampaignsHandler);
  fastify.post('/push-campaigns', { preHandler: [fastify.authenticate] }, createPushCampaignHandler);

  // Support Tickets
  fastify.get('/support-tickets', { preHandler: [fastify.authenticate] }, getSupportTicketsHandler);
  fastify.put('/support-tickets/:id', { preHandler: [fastify.authenticate] }, updateSupportTicketHandler);

  // Community
  fastify.get('/community/stats', { preHandler: [fastify.authenticate] }, getCommunityStatsHandler);
  fastify.get('/community/groups', { preHandler: [fastify.authenticate] }, getCommunityGroupsHandler);

  // Monitoring
  fastify.get('/live-sessions', { preHandler: [fastify.authenticate] }, getLiveSessionsHandler);
  fastify.get('/activity-logs', { preHandler: [fastify.authenticate] }, getActivityLogsHandler);
  fastify.get('/session-recordings', { preHandler: [fastify.authenticate] }, getSessionRecordingsHandler);
  fastify.get('/error-logs', { preHandler: [fastify.authenticate] }, getErrorLogsHandler);
}
