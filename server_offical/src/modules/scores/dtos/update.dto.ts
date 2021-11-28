import { IsNotEmpty } from "class-validator";
export default class CreateScoreDto {
  constructor(
    _id: string,
    score: number,
  ) {
    this._id = _id;
    this.score = score;
  }

  public _id: string;
  public score: number;
}