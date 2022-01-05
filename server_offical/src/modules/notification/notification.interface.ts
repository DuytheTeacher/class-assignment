const { ObjectId } = require('mongoose').Types;

export default interface NotificationInterface {
  _id: string;
  auth: string;
  objectReview: string;
  receiver: Array<string>;
  action: string;
  createAt: Date;
  updateAt: Date;
}
