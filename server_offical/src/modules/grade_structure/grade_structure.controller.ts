import { NextFunction, Request, Response } from 'express';
import BodyRespone from '@core/response_default';
import CreateGradeStructureInterface from './dtos/createGradeStructure';
import GradeStructureService from './grade_structure.service';
import GradeStructureInterface from './grade_structure.interface';
import UpdateGradeStructureInterface from './dtos/updateGradeStructure';

export default class GradeStructureController {
  private gradeStructureService = new GradeStructureService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const classId = req.body.classId;
      const model: Array<CreateGradeStructureInterface> =
        req.body.createGradesStructure;
      const gradesStructures: Array<GradeStructureInterface> =
        await this.gradeStructureService.create(userId, model, classId);

      const resp = new BodyRespone('Success', gradesStructures);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listGrades = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classId = req.params.classId;
      const listGradeStructure: Array<GradeStructureInterface> =
        await this.gradeStructureService.listGrades(userId, classId);

      const resp = new BodyRespone('Success', listGradeStructure);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateGradeStructure = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classId = req.body.classId;
      const model: Array<UpdateGradeStructureInterface> =
        req.body.updateGradesStructure;
      const user: Array<GradeStructureInterface> =
        await this.gradeStructureService.update(userId, model, classId);

      const resp = new BodyRespone('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
