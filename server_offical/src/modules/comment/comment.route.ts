import { Route } from '@core/interfaces';
import { authMiddleware, uploadFileMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { Router } from 'express';
import CommentController from './comment.controller';
import CreateScoreDto from './dtos/create.dto';
export default class ClassroomsRoute implements Route {
  public path = '/api/scores/reviews/comments';
  public router = Router();

  public commentController = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateScoreDto, true),
      authMiddleware,
      this.commentController.create
    );

    this.router.get(
      `${this.path}/get_list_comments`,
      authMiddleware,
      this.commentController.listCommentsByReviewId
    );
  }
}
