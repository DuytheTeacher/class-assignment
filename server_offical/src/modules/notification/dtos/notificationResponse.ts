import { ObjectId } from 'mongoose';

export default class NotificationObject {
  public action: string;
  public auth: string;
  public objectReview: string;
  public receiver: Array<string>;

  public constructor(
    action: string,
    auth: string,
    objectReview: string,
    receiver: Array<string>
  ) {
    this.action = action;
    this.auth = auth;
    this.objectReview = objectReview;
    this.receiver = receiver;
  }
}
