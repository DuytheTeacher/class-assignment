import mongoose from "mongoose";
import Classroom from "./classrooms.interface";

const { ObjectId } = require("mongoose").Types;

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
  },
  user: [
    {
      type: String,
      ref: "user",
    },
  ],
  createTime: {
    type: Date,
    default: Date.now()
  },
});

const User = mongoose.model<Classroom & mongoose.Document>(
  "classroom",
  ClassroomSchema
);

export default User;
