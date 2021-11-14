import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
export default class LoginDto {
  constructor(
    account_name: string,
    password: string,
  ) {
    this.account_name = account_name;
    this.password = password;
  }

  @IsNotEmpty()
  public account_name: string;
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
