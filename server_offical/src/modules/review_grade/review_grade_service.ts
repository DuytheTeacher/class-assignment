import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import { UserSchema } from '@modules/users';
import { Classroom, ClassroomSchema } from '@modules/classrooms';
import ScoreSchema from '@modules/scores/scores.model';
import ReviewGradeSchema from '@modules/review_grade/review_grade.model';
import ReviewInterface from './review_grade.interface';
import CreateReviewDto from './dtos/create.dto';
import ScoreInterface from '@modules/scores/scores.interface';
class ReviewGradeService {
  public reviewGradeSchema = ReviewGradeSchema;

  public async create(
    userId: string,
    model: CreateReviewDto
  ): Promise<ReviewInterface> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type !== 0) {
      throw new HttpException(400, `User is  not student `);
    }

    const score = await ScoreSchema.findOne({
      _id: model.scoreId,
      studentId: model.studentId,
    }).exec();
    if (!score) {
      throw new HttpException(409, `Score is not exist`);
    }
    const userInClass = await ClassroomSchema.findOne({
      _id: score.classId,
      participants_id: userId,
    });
    if (!userInClass) {
      throw new HttpException(404, `User is not Student in classroom`);
    }
    const dataReview = await this.reviewGradeSchema
      .findOne({ auth: userId, scoreId: model.scoreId })
      .exec();
    if (dataReview) {
      throw new HttpException(400, `Data already exist`);
    }
    const review: ReviewInterface = await this.reviewGradeSchema.create({
      ...model,
      auth: userId,
    });
    return review;
  }
  public async getListReviewByUser(
    userId: string
  ): Promise<Array<ReviewInterface>> {
    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    const listclass = <any>await ClassroomSchema.find({
      participants_id: userId,
    })
      .select({ _id: 1 })
      .exec();
    if (!listclass) {
      throw new HttpException(404, `User do not join classrooms`);
    }
    const listScore = <any>await ScoreSchema.find({
      classId: { $in: listclass },
    })
      .select({ _id: 1 })
      .exec();
    if (!listScore) {
      throw new HttpException(404, `Score is not exist `);
    }
    let listReview;

    if (user.user_type === 1) {
      listReview = <any>(
        await this.reviewGradeSchema.find({ $in: listScore }).exec()
      );
      if (!listReview) {
        throw new HttpException(404, `Reviews is not Exist`);
      }
    }
    if (user.user_type === 0) {
      listReview = <any>(
        await this.reviewGradeSchema.find({ auth: userId }).exec()
      );
      if (!listReview) {
        throw new HttpException(404, `Reviews is not Exist`);
      }
    }
    return listReview;
  }
  public async getReviewById(
    userId: string,
    reviewId: string
  ): Promise<ReviewInterface> {
    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    let review;
    if (user.user_type === 0) {
      review = await this.reviewGradeSchema
        .findOne({ _id: reviewId, auth: userId })
        .exec();
      if (!review) {
        throw new HttpException(404, `Review is not exists`);
      }
      return review;
    }
    review = await this.reviewGradeSchema.findOne({ _id: reviewId }).exec();
    if (!review) {
      throw new HttpException(404, `Review is not exists`);
    }
    const score = await ScoreSchema.findOne({ _id: review.scoreId }).exec();
    if (!score) {
      throw new HttpException(404, `Score in Review  not exists`);
    }
    const classroom = await ClassroomSchema.findOne({
      _id: score.classId,
      participants_id: userId,
    });
    if (!classroom) {
      throw new HttpException(400, `You is not a Teacher in class`);
    }
    return review;
  }
}

export default ReviewGradeService;
