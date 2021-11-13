import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
export default class RegisterDto {
  constructor(
    account_name: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    type: number,
  ) {
    this.account_name = account_name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  @IsNotEmpty()
  public account_name: string;
  @IsNotEmpty()
  public first_name: string;
  @IsNotEmpty()
  public last_name: string;
  @IsNotEmpty()
  @IsNotEmpty()
  public email: string;
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
  @IsNotEmpty()
  public type: number;
}
