// In MongoNotificationRepository.ts
import NotificationModel from '../database/models/NotificationModel';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import mongoose from 'mongoose';

export class MongoNotificationRepository implements NotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    const newNotification = new NotificationModel(notification);
    await newNotification.save();
    return newNotification.toObject();
  }

  async findById(id: string): Promise<Notification | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const notification = await NotificationModel.findById(id);
    return notification ? notification.toObject() : null;
  }

  async findByUserId(userId: string, limit = 50): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      $or: [
        { targetUserIds: userId },
        { sendToAll: true }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    return notifications.map(n => n.toObject());
  }

  async findByRole(role: string, limit = 50): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      $or: [
        { targetRoles: role },
        { sendToAll: true }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    return notifications.map(n => n.toObject());
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) return;
    
    const notification = await NotificationModel.findById(notificationId);
    if (notification) {
      await notification.markAsRead(userId);
    }
  }

  async countUnread(userId: string): Promise<number> {
    const notifications = await this.findByUserId(userId);
    return notifications.filter(n => {
      // If read property doesn't exist, notification is unread
      if (!n.read) return true;
      
      // Handle differently based on whether read is a Map or an object
      if (n.read instanceof Map) {
        return n.read.get(userId) !== true;
      } else {
        return n.read[userId] !== true;
      }
    }).length;
  }
}