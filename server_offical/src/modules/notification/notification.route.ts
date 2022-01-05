import { Route } from '@core/interfaces';
import { authMiddleware, uploadFileMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { Router } from 'express';
import NotificationController from './notification.controller';
export default class NotificationRoute implements Route {
  public path = '/api/notifications';
  public router = Router();

  public notificationController = new NotificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/get_list`,
      authMiddleware,
      this.notificationController.listNotificationByUser
    );
  }
}
