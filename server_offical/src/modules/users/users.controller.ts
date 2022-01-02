import { IUser, TokenData } from '@modules/auth';
import { NextFunction, Request, Response } from 'express';
import RegisterDto from './dtos/register.dto';
import UserService from './users.service';
import BodyResponse from '@core/response_default';
import UpdateDto from './dtos/update.dto';
import { Classroom } from '@modules/classrooms';

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
      const userCurrentId = req.user.id;
      const user: IUser = await this.userService.getUserById(
        userCurrentId,
        userId
      );

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
      const user: IUser = await this.userService.getUserByEmail(
        email as string
      );

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
  public blockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userBlockId = req.user.id;
      const userId = req.query.userId;
      const user: IUser = await this.userService.blockUserById(
        userId as string,
        userBlockId
      );
      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
  public unMappStudentIdOfAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const adminId = req.user.id;
      const studentId = req.body.studentId;
      const memberId = req.body.memberId;
      const classroomId = req.body.classroomId;
      const user: IUser = await this.userService.unMappStudentIdOfAccount(
        studentId,
        memberId,
        adminId,
        classroomId
      );

      const resp = new BodyResponse('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
  public getListUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const typeUserGet = req.query.typeUserGet;
      const users: Array<IUser> = await this.userService.getlistUser(
        userId,
        Number(typeUserGet)
      );

      const resp = new BodyResponse('Success', users);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
  public getListClassroomByCreateTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const typeSort = req.query.typeSort;
      const users: Array<Classroom> =
        await this.userService.getListClassroomSortByTime(
          userId,
          Number(typeSort)
        );

      const resp = new BodyResponse('Success', users);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
  public getListClassroomBySearchName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const nameSearch = req.query.nameSearch;
      const users: Array<Classroom> =
        await this.userService.getListClassroomSortBySearch(
          userId,
          nameSearch as string
        );

      const resp = new BodyResponse('Success', users);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
