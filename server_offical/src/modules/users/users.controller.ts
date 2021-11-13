import { TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import RegisterDto from "./dtos/register.dto";
import UserService from "./users.service";
import BodyRespone from "@core/response_default";

export default class UserController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const tokenData: TokenData = await this.userService.createUser(model);

      const resp = new BodyRespone("Success", tokenData);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
