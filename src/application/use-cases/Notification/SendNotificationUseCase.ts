// src/application/use-cases/Notification/NotificationUseCase.ts
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';
import { Notification } from '../../../domain/entities/Notification';
import { getSocketService } from '../../../infrastructure/services/SocketService';

export class SendNotificationUseCase {
  constructor(
    private notificationRepository: NotificationRepository
  ) { }

  async execute(notification: Notification): Promise<Notification> {

    console.log(notification, '---')

    const createdNotification = await this.notificationRepository.create(notification);
    
    const socketService = getSocketService();
    
    if (notification.targetGroup === "all" ) {
        socketService.broadcastNotification(createdNotification);
      } else {
        if (notification.targetGroup === "job_seeker" || notification.targetGroup === "recruiter") {
          socketService.sendNotificationByRole(notification.targetGroup, createdNotification);
        }
      
        if (notification.targetUserIds && notification.targetUserIds.length > 0) {
          notification.targetUserIds.forEach(userId => {
            socketService.sendNotificationToUser(userId, createdNotification);
          });
        }
      }
      
    return createdNotification;
  }

}