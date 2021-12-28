const { ObjectId } = require('mongoose').Types;

export default interface CommentInterface {
  _id: string;
  auth: string;
  reviewId: string;
  content: string;
  createAt: Date;
  updateAt: Date;
}
