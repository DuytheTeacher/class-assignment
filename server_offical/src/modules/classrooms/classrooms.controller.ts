import { IUser, TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import BodyRespone from "@core/response_default";
import CreateDto from "./dtos/create.dto"
import ClassroomService from "./classrooms.service";
import Classroom from "./classrooms.interface"

export default class ClassroomsController {
  private classroomService = new ClassroomService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const model: CreateDto = req.body;
      const classroom: Classroom = await this.classroomService.create(userId, model);

      const resp = new BodyRespone("Success", classroom);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
