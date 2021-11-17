import { IsNotEmpty } from "class-validator";
export default class CreateDto {
  constructor(
    name: string,
    description: string,
    thumbnail: string,
    backdrop: string,
  ) {
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
    this.backdrop = backdrop;
  }

  @IsNotEmpty()
  public name: string;
  @IsNotEmpty()
  public description: string;
  public thumbnail: string;
  public backdrop: string;
}
