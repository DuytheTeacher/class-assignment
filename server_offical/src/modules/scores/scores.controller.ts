import { NextFunction, Request, Response } from 'express';
import BodyResponse from '@core/response_default';
import CreateScoresDto from './dtos/create.dto';
import UpdateScoresDto from './dtos/update.dto';
import ScoreService from './scores.service';
import ScoreInterface from './scores.interface';

export default class ScoresController {
  private scoreService = new ScoreService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const classId = req.body.classId;
      const model: Array<CreateScoresDto> =
        req.body.createScores;
      const score: Array<ScoreInterface> =
        await this.scoreService.create(userId, classId, model);

      const resp = new BodyResponse('Success', score);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listScoresByStudentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classId = req.query.classId;
      const studentId = req.query.studentId;
      const listGradeStructure: Array<ScoreInterface> =
        await this.scoreService.listScoresByStudentId(userId, classId as string, studentId as string);

      const resp = new BodyResponse('Success', listGradeStructure);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: Array<UpdateScoresDto> =
        req.body.updateGradesStructure;
      const scores: Array<ScoreInterface> =
        await this.scoreService.update(model);
      const resp = new BodyResponse('Success', scores);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}