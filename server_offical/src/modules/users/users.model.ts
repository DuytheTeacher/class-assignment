import mongoose from "mongoose";
import { IUser } from "./users.interface";
const { ObjectId } = require("mongoose").Types;

const UserSchema = new mongoose.Schema({
  account_name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
  user_type: {
    type: Number,
  },
  class_list_id: [
    {
      type: ObjectId,
      ref: "classroom",
    },
  ],
  reg_type: {
    type: Number,
  },
  list_object_studentId: [
    {
      classroomId: {
        type: String,
        required: true,
      },
      studentId: {
        type: String,
        required: true,
      },
    }
  ]
});

const User = mongoose.model<IUser & mongoose.Document>("user", UserSchema);

export default User;
