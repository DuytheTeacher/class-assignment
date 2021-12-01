import { Route } from '@core/interfaces';
import { authMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { Router } from 'express';
import GradeStructureController from './grade_structure.controller';

export default class GradeStructureRoute implements Route {
  public path = '/api/gradestructure';
  public router = Router();

  public gradeStructureController = new GradeStructureController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      authMiddleware,
      this.gradeStructureController.create
    );

    this.router.get(
      `${this.path}/get`,
      authMiddleware,
      this.gradeStructureController.listGrades
    );
    this.router.put(
      `${this.path}/update`,
      authMiddleware,
      this.gradeStructureController.updateGradeStructure
    );
    this.router.delete(
      `${this.path}/delete`,
      authMiddleware,
      this.gradeStructureController.deleteGradeStructure
    );
  }
}
