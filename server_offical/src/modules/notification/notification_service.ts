import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import { UserSchema } from '@modules/users';
import ReviewGradeSchema from '@modules/review_grade/review_grade.model';
import Notification from '@modules/notification/notification.model';
import NotificationInterface from './notification.interface';
class NotificationService {
  public notificationSchema = Notification;

  public async getListNotificationByUser(
    userId: string
  ): Promise<Array<NotificationInterface>> {
    const user = await UserSchema.findOne({ _id: userId, isBlocked: 0 }).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    const listNotification = <any>await this.notificationSchema
      .find({
        receiver: userId,
      })
      .populate('auth')
      .populate('objectReview')
      .exec();
    if (!listNotification) {
      throw new HttpException(404, `Notifications Not found`);
    }

    return listNotification;
  }
}

export default NotificationService;
