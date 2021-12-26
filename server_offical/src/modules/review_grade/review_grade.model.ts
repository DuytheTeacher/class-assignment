import mongoose from 'mongoose';
const { ObjectId } = require('mongoose').Types;
import ReviewInterface from './review_grade.interface';
const ReviewGradechema = new mongoose.Schema(
  {
    auth: {
      type: ObjectId,
      required: true,
      ref: 'user',
    },
    studentId: {
      type: String,
    },
    scoreId: {
      type: String,
      required: true,
      ref: 'score',
    },
    expectation_grade: {
      type: Number,
      required: true,
    },
    explanation_message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewGrade = mongoose.model<ReviewInterface & mongoose.Document>(
  'reviewgrade',
  ReviewGradechema
);

export default ReviewGrade;
