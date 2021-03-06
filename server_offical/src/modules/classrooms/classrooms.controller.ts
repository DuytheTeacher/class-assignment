import { IUser } from '@modules/users';
import { NextFunction, Request, Response } from 'express';
import BodyResponse from '@core/response_default';
import CreateDto from './dtos/create.dto';
import ClassroomService from './classrooms.service';
import { Classroom } from './classrooms.interface';
import { Workbook } from 'exceljs';

export default class ClassroomsController {
  private classroomService = new ClassroomService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const model: CreateDto = req.body;
      const classroom: Classroom = await this.classroomService.create(
        userId,
        model
      );

      const resp = new BodyResponse('Success', classroom);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = req.query.id;
      const classroom: Classroom = await this.classroomService.getDetail(
        classId as string
      );

      const resp = new BodyResponse('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listUserInClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = req.query.id;
      const classroom: Array<IUser> =
        await this.classroomService.listUserInClassroom(classId as string);
      const resp = new BodyResponse('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listClassroomByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classroom: Array<Classroom> =
        await this.classroomService.listClassroomByUserId(userId as string);
      const resp = new BodyResponse('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listClassroom: Array<Classroom> =
        await this.classroomService.listClassroom();

      const resp = new BodyResponse('Success', listClassroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public joinInClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.query.userId;
      const classId = req.query.classId;
      const classroom: Classroom = await this.classroomService.joinInClassroom(
        classId as string,
        userId as string,
      );

      const resp = new BodyResponse('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createClassroomInvitationLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.body.idReceiver;
      const classId = req.body.classId;
      const invitationLink: string =
        await this.classroomService.createClassroomInvitationLink(
          classId,
          userId
        );

      const resp = new BodyResponse('Success', {
        invitationLink: invitationLink,
      });
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public sendClassroomInvitationLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const mail = req.body.mail;
      const link = req.body.link;
      const notification: string =
        await this.classroomService.sendClassroomInvitationLink(
          userId,
          mail,
          link
        );

      const resp = new BodyResponse('Success', {});
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public uploadListStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classId = req.body.classId;
      const file = req.file;
      const notification: string =
        await this.classroomService.uploadListStudents(
          file,
          classId
        );

      const resp = new BodyResponse('Success', {notification: notification});
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public downloadFileTemplateListStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const excel: Workbook = await this.classroomService.downloadFileTemplateListStudents();
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "liststudents.xlsx"
      );

      excel.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (error) {
      next(error);
    }
  };
}
