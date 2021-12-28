import { IsNotEmpty } from 'class-validator';
export default class RequestDto {
  constructor(reviewId: string, content: string) {
    this.reviewId = reviewId;
    this.content = content;
  }
  @IsNotEmpty()
  public reviewId: string;
  @IsNotEmpty()
  public content: string;
}
