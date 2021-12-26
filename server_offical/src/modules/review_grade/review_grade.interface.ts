const { ObjectId } = require('mongoose').Types;

export default interface ReviewInterface {
  _id: string;
  auth: string;
  studentId: string;
  scoreId: string;
  expectation_grade: number;
  explanation_message: string;
  createAt: Date;
  updateAt: Date;
}
