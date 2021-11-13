import { Route } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";
import validationMiddleware from "@core/middleware/validation.middleware";
import { Router } from "express";
import ClassroomsController from "./classrooms.controller";
import CreateDto from "./dtos/create.dto";

export default class ClassroomsRoute implements Route {
  public path = "/api/classrooms";
  public router = Router();

  public classroomsController = new ClassroomsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateDto, true),
      authMiddleware,
      this.classroomsController.create
    );

  }
}
