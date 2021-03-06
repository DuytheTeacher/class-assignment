import mongoose from 'mongoose';
import { Classroom } from './classrooms.interface';

const { ObjectId } = require('mongoose').Types;

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  auth: {
    auth_id: { type: String, required: true },
    name: { type: String, required: true },
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  backdrop: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  finishTime: {
    type: Date,
  },
  participants_id: [
    {
      type: ObjectId,
      ref: 'user',
    },
  ],
  list_students_from_xlsx: [
    {
      student_id: { type: String, required: true },
      full_name: { type: String, required: true },
    },
  ],
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model<Classroom & mongoose.Document>(
  'classroom',
  ClassroomSchema
);

export default User;
