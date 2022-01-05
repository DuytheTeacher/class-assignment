import { NextFunction, Request, Response } from 'express';
import BodyResponse from '@core/response_default';
import NotificationService from './notification_service';

export default class NotificationController {
  private notificationService = new NotificationService();

  public listNotificationByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const notifications =
        await this.notificationService.getListNotificationByUser(userId);
      const resp = new BodyResponse('Success', notifications);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
