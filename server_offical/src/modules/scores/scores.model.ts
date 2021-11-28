import mongoose from 'mongoose';
import Score from './scores.interface';

const { ObjectId } = require('mongoose').Types;

const ScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  studentId: {
    type: ObjectId,
    ref: 'user',
  },
  classId: {
    type: ObjectId,
    ref: 'classroom',
  },
  gradesStructId: {
    type: ObjectId,
    ref: 'classroom',
  },
  score: {
    type: Number,
  },
  ordinal: {
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

const Score = mongoose.model<Score & mongoose.Document>(
  'grades',
  ScoreSchema
);

export default Score;
