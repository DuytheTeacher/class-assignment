import { NextFunction, Request, Response } from 'express';
import BodyResponse from '@core/response_default';
import CreateScoresDto from './dtos/create.dto';
import CommentService from './comment.service';
import CommentInterface from './comment.interface';

export default class ReviewsController {
  private commentService = new CommentService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const model: CreateScoresDto = req.body;
      const comment: CommentInterface = await this.commentService.create(
        userId,
        model
      );
      const resp = new BodyResponse('Success', comment);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listCommentsByReviewId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const reviewId = req.query.reviewId;
      const comments = await this.commentService.getListCommentByReviewId(
        userId,
        reviewId as string
      );
      const resp = new BodyResponse('Success', comments);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
