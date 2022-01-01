import { NextFunction, Request, Response } from 'express';
import BodyResponse from '@core/response_default';
import CreateReviewDto from './dtos/create.dto';
import ReviewGradeService from './review_grade_service';
import ReviewInterface from './review_grade.interface';

export default class ReviewsController {
  private reviewService = new ReviewGradeService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const model: CreateReviewDto = req.body;
      const review: ReviewInterface = await this.reviewService.create(
        userId,
        model
      );
      const resp = new BodyResponse('Success', review);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listReviewsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const reviews = await this.reviewService.getListReviewByUser(userId);
      const resp = new BodyResponse('Success', reviews);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
  public getReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const reviewId = req.query.reviewId;
      const review = await this.reviewService.getReviewById(
        userId,
        reviewId as string
      );
      const resp = new BodyResponse('Success', review);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
