import { IsNotEmpty } from "class-validator";
export default class CreateScoreDto {
  constructor(
    studentId: string,
    gradesStructId: string,
    score: number,
  ) {
    this.studentId = studentId;
    this.gradesStructId = gradesStructId;
    this.score = score;
  }

  public studentId: string;
  public gradesStructId: string;
  public score: number;
}