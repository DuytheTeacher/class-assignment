const { ObjectId } = require('mongoose').Types;

export default interface GradeStructureInterface {
  _id: string;
  name: string;
  auth: string;
  classroom: string;
  maxScore: number;
  ordinal: number;
  createAt: Date;
  updateAt: Date;
}
