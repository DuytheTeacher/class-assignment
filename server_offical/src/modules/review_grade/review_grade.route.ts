import { Route } from '@core/interfaces';
import { authMiddleware, uploadFileMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { Router } from 'express';
import ReviewsController from './review_grade.controller';
import CreateScoreDto from './dtos/create.dto';
export default class ClassroomsRoute implements Route {
  public path = '/api/scores/reviews';
  public router = Router();

  public reviewsController = new ReviewsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateScoreDto, true),
      authMiddleware,
      this.reviewsController.create
    );

    this.router.get(
      `${this.path}/get_list_reviews`,
      authMiddleware,
      this.reviewsController.listReviewsByUser
    );

    this.router.get(
      `${this.path}/get_review`,
      authMiddleware,
      this.reviewsController.getReviewById
    );
  }
}
