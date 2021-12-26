import { IsNotEmpty } from 'class-validator';
export default class RequestDto {
  constructor(
    scoreId: string,
    studentId: string,
    expectation_grade: number,
    explanation_message: string
  ) {
    this.scoreId = scoreId;
    this.explanation_message = explanation_message;
    this.expectation_grade = expectation_grade;
    this.studentId = studentId;
  }
  @IsNotEmpty()
  public scoreId: string;
  @IsNotEmpty()
  public studentId: string;
  @IsNotEmpty()
  public explanation_message: string;
  @IsNotEmpty()
  public expectation_grade: number;
}
