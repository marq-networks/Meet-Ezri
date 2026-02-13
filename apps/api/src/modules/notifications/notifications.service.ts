import prisma from '../../lib/prisma';
import { CreateNotificationInput } from './notifications.schema';

export const notificationsService = {
  async create(input: CreateNotificationInput) {
    return prisma.notifications.create({
      data: input,
    });
  },

  async broadcast(input: Omit<CreateNotificationInput, 'user_id'>) {
    const profiles = await prisma.profiles.findMany({ select: { id: true } });
    
    const data = profiles.map(p => ({
      user_id: p.id,
      type: input.type,
      title: input.title,
      message: input.message,
      metadata: input.metadata,
      is_read: false
    }));

    return prisma.notifications.createMany({
      data,
    });
  },

  async findAll(userId: string) {
    return prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notifications.update({
      where: { id, user_id: userId },
      data: { is_read: true },
    });
  },

  async markAllAsRead(userId: string) {
     return prisma.notifications.updateMany({
       where: { user_id: userId, is_read: false },
       data: { is_read: true },
     });
  },

  async getUnreadCount(userId: string) {
    return prisma.notifications.count({
      where: { user_id: userId, is_read: false },
    });
  }
};
