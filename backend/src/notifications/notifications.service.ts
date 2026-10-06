import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type NotificationRecord = {
  id: number;
  userId: number;
  isRead: boolean;
  createdAt: Date;
  [key: string]: unknown;
};
type UpdateManyResult = {
  count: number;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): {
    notification: {
      findMany: (query: any) => Promise<NotificationRecord[]>;
      count: (query: any) => Promise<number>;
      updateMany: (query: any) => Promise<UpdateManyResult>;
    };
  } {
    return this.prisma as unknown as {
      notification: {
        findMany: (query: any) => Promise<NotificationRecord[]>;
        count: (query: any) => Promise<number>;
        updateMany: (query: any) => Promise<UpdateManyResult>;
      };
    };
  }

  getNotifications(userId: number): Promise<NotificationRecord[]> {
    return this.prismaClient.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prismaClient.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: number, userId: number): Promise<UpdateManyResult> {
    return this.prismaClient.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: number): Promise<UpdateManyResult> {
    return this.prismaClient.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
