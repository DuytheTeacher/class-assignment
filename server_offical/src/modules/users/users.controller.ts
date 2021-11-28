import { IUser, TokenData } from '@modules/auth';
import { NextFunction, Request, Response } from 'express';
import RegisterDto from './dtos/register.dto';
import UserService from './users.service';
import BodyResponse from '@core/response_default';
import UpdateDto from './dtos/update.dto';

export default class UserController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const tokenData: TokenData = await this.userService.createUser(model);
      const resp = new BodyResponse('Success', tokenData);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const user: IUser = await this.userService.getUserById(userId);

      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const email = req.query.email;
      const user: IUser = await this.userService.getUserByEmail(email as string);

      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const model: UpdateDto = req.body;
      const user: IUser = await this.userService.updateUser(userId, model);

      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public mappingStudentIdWithAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const studentId = req.body.studentId;
      const classroomId = req.body.classroomId;
      const user: IUser = await this.userService.mappingStudentIdWithAccount(
        studentId,
        userId,
        classroomId
      );

      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
