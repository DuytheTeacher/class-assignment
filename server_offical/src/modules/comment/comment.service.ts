import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import { UserSchema } from '@modules/users';
import { Classroom, ClassroomSchema } from '@modules/classrooms';
import ScoreSchema from '@modules/scores/scores.model';
import CommentSchema from '@modules/comment/comment.model';
import CommentInterface from './comment.interface';
import CreateReviewDto from './dtos/create.dto';
import ScoreInterface from '@modules/scores/scores.interface';
import ReviewGrade from '@modules/review_grade/review_grade.model';
class CommentService {
  public commentSchema = CommentSchema;

  public async create(
    userId: string,
    model: CreateReviewDto
  ): Promise<CommentInterface> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type === 2) {
      throw new HttpException(400, `You can not comment `);
    }
    const review = await ReviewGrade.findOne({
      _id: model.reviewId,
    }).exec();
    if (!review) {
      throw new HttpException(409, `Review is not exist`);
    }

    const score = await ScoreSchema.findOne({
      _id: review.scoreId,
    }).exec();
    if (!score) {
      throw new HttpException(409, `Score is not exist`);
    }
    const userInClass = await ClassroomSchema.findOne({
      _id: score.classId,
      participants_id: userId,
    });
    if (!userInClass) {
      throw new HttpException(400, 'User do not join classroom ');
    }
    const comment: CommentInterface = await this.commentSchema.create({
      ...model,
      auth: userId,
    });
    return comment;
  }
  public async getListCommentByReviewId(
    userId: string,
    reviewId: string
  ): Promise<Array<CommentInterface>> {
    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    const review = await ReviewGrade.findById(reviewId).exec();
    if (!review) {
      throw new HttpException(404, `Review is not exist `);
    }
    let listComment;
    if (user.user_type === 0) {
      listComment = <any>(
        await this.commentSchema
          .find({ reviewId: reviewId, auth: userId })
          .exec()
      );
      if (!listComment) {
        throw new HttpException(400, 'Can not get list review');
      }
    }
    if (user.user_type === 1) {
      const score = await ScoreSchema.findOne({ _id: review.scoreId }).exec();
      if (!score) {
        throw new HttpException(404, `Score is not exist `);
      }
      const teacherInClass = await ClassroomSchema.findOne({
        _id: score.classId,
        participants_id: userId,
      });
      if (!teacherInClass) {
        throw new HttpException(400, 'Teacher do not join this ClassRoom');
      }
      listComment = <any>(
        await this.commentSchema.find({ reviewId: reviewId }).exec()
      );
      if (!listComment) {
        throw new HttpException(404, `Comments is not exist `);
      }
    }

    return listComment;
  }
}

export default CommentService;
