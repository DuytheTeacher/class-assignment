import mongoose from 'mongoose';
const { ObjectId } = require('mongoose').Types;
import NotificationInterface from './notification.interface';
const NotificationSchema = new mongoose.Schema(
  {
    auth: {
      type: ObjectId,
      required: true,
      ref: 'user',
    },
    objectReview: {
      type: ObjectId,
      ref: 'reviewgrade',
    },
    receiver: [
      {
        type: ObjectId,
        ref: 'user',
      },
    ],
    action: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<NotificationInterface & mongoose.Document>(
  'notification',
  NotificationSchema
);

export default Notification;
