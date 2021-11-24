import mongoose from 'mongoose';
const { ObjectId } = require('mongoose').Types;
import GradeStructureInterface from './grade_structure.interface';
const GradeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    auth: {
      type: ObjectId,
      required: true,
      ref: 'user',
    },
    classroom: {
      type: ObjectId,
      required: true,
      ref: 'classroom',
    },
    ordinal: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const GradeStructure = mongoose.model<
  GradeStructureInterface & mongoose.Document
>('gradestructure', GradeStructureSchema);

export default GradeStructure;
