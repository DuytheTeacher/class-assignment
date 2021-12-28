import mongoose from 'mongoose';
const { ObjectId } = require('mongoose').Types;
import CommentInterface from './comment.interface';
const Commentchema = new mongoose.Schema(
  {
    auth: {
      type: ObjectId,
      required: true,
      ref: 'user',
    },
    reviewId: {
      type: String,
      required: true,
      ref: 'reviewgrade',
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentGrade = mongoose.model<CommentInterface & mongoose.Document>(
  'comment',
  Commentchema
);

export default CommentGrade;
