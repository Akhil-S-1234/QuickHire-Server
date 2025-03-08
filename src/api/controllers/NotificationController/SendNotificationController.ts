// src/api/controllers/notification/SendNotificationController.ts
import { RequestHandler, Request, Response } from 'express';
import { SendNotificationUseCase } from '../../../application/use-cases/Notification/SendNotificationUseCase';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { NotificationType } from '../../../domain/entities/Notification';

export class SendNotificationController {
  constructor(
    private sendNotificationUseCase: SendNotificationUseCase
  ) { }

  handle: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, message, type, targetGroup, sendToAll } = req.body;

      const notification = {
        title,
        message,
        type: type || NotificationType.SYSTEM,
        targetGroup,
        sendToAll: sendToAll || false,
        createdAt: new Date(),
        read: {}
      };

      const createdNotification = await this.sendNotificationUseCase.execute(notification);
      
      res.status(HttpStatus.CREATED).json(createResponse('success', 'Notification sent successfully', createdNotification));
    } catch (error: any) {
      console.error('Failed to send notification:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to send notification', error.message));
    }
  };
}