import { Notification } from '../entities/Notification';

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, limit?: number): Promise<Notification[]>;
  findByRole(role: string, limit?: number): Promise<Notification[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  countUnread(userId: string): Promise<number>;
}