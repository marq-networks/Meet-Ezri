import { z } from 'zod';

export const dashboardStatsSchema = z.object({
  totalUsers: z.number(),
  activeSessions: z.number(),
  totalSessions: z.number(),
  revenue: z.number(),
  systemHealth: z.array(z.object({
    name: z.string(),
    value: z.string(),
    status: z.string(),
    color: z.string(),
    percentage: z.number()
  })),
  userGrowth: z.array(z.object({
    month: z.string(),
    users: z.number(),
    orgs: z.number()
  })),
  sessionActivity: z.array(z.object({
    day: z.string(),
    sessions: z.number(),
    duration: z.number()
  })),
  revenueData: z.array(z.object({
    month: z.string(),
    revenue: z.number()
  })),
  platformDistribution: z.array(z.object({
    name: z.string(),
    value: z.number(),
    color: z.string()
  }))
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
