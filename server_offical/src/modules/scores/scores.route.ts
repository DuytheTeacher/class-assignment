import {
  Route
} from '@core/interfaces';
import {
  authMiddleware, uploadFileMiddleware
} from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import {
  Router
} from 'express';
import ScoresController from './scores.controller';
import CreateScoreDto from './dtos/create.dto';
import UpdateScoreDto from './dtos/update.dto';

export default class ClassroomsRoute implements Route {
  public path = '/api/scores';
  public router = Router();

  public scoresController = new ScoresController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateScoreDto, true),
      authMiddleware,
      this.scoresController.create
    );

    this.router.put(
      `${this.path}/update`,
      validationMiddleware(UpdateScoreDto, true),
      authMiddleware,
      this.scoresController.update
    );

    this.router.get(
      `${this.path}/get_list_by_student_id`,
      authMiddleware,
      this.scoresController.listScoresByStudentId
    );

    this.router.post(
      `${this.path}/upload_file_list_scores_of_students`,
      authMiddleware,
      uploadFileMiddleware.single("file"),
      this.scoresController.uploadScoresOfListStudents
    )
  }
}