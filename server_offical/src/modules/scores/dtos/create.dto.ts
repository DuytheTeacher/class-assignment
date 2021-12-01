import { IsNotEmpty } from "class-validator";
export default class CreateScoreDto {
  constructor(
    classId: string,
    studentId: string,
    gradesStructId: string,
    score: number,
  ) {
    this.classId = classId;
    this.studentId = studentId;
    this.gradesStructId = gradesStructId;
    this.score = score;
  }

  public classId: string;
  public studentId: string;
  public gradesStructId: string;
  public score: number;
}