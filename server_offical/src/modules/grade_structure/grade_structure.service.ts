import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import GradeStructureSchema from './grade_structure.model';
import UpdateGradeStructureInterface from './dtos/updateGradeStructure';
import CreateGradeStructureInterface from './dtos/createGradeStructure';
import GradeStructureInterface from './grade_structure.interface';
import { UserSchema } from '@modules/users';
import { ClassroomSchema } from '@modules/classrooms';
import { _UpdateQuery } from 'mongoose';
import ScoreSchema from '@modules/scores/scores.model';

class GradeStructureService {
  public gradeStructureSchema = GradeStructureSchema;

  public async create(
    userId: string,
    model: Array<CreateGradeStructureInterface>,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findOne({ _id: userId, isBlocked: 0 }).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }

    let count = 0;
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const gradestructure = await this.gradeStructureSchema
        .findOne({
          name: model[i].name,
          auth: userId,
          classroom: classId,
        })
        .exec();
      if (gradestructure) {
        count++;
        continue;
      }
      const createGradeStructure: GradeStructureInterface =
        await this.gradeStructureSchema.create({
          ...model[i],
          auth: userId,
          classroom: classId,
        });
      gradesStructures.push(createGradeStructure);
    }

    if (count == model.length) {
      throw new HttpException(400, `Data already exist`);
    }

    return gradesStructures;
  }

  public async listGrades(
    userId: string,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    const user = await UserSchema.findOne({ _id: userId, isBlocked: 0 }).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }
    const listGrades = <any>(
      await this.gradeStructureSchema
        .find({ classroom: classId })
        .sort({ ordinal: 1 })
    );

    if (!listGrades) {
      throw new HttpException(409, `Grades is not exist`);
    }

    return listGrades;
  }
  public async update(
    userId: string,
    model: Array<UpdateGradeStructureInterface>,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    let count = 0;
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const updateGradeStructure =
        await this.gradeStructureSchema.findOneAndUpdate(
          {
            _id: model[i]._id,
            auth: userId,
            classroom: classId,
          },
          { ...model[i] },
          { new: true }
        );

      //update tabe scores
      const updateScores = await ScoreSchema.updateMany(
        {
          gradesStructId: model[i]._id,
        },
        { name: model[i].name, ordinal: model[i].ordinal },
        { new: true }
      );

      if (!updateGradeStructure) {
        count++;
        continue;
      }
      gradesStructures.push(updateGradeStructure);
    }

    if (count == model.length) {
      throw new HttpException(400, `Error when update`);
    }

    return gradesStructures;
  }

  public async delete(
    userId: string,
    model: Array<UpdateGradeStructureInterface>,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    let count = 0;
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const updateGradeStructure =
        await this.gradeStructureSchema.findOneAndDelete({
          _id: model[i]._id,
          name: model[i].name,
          auth: userId,
          classroom: classId,
        });
      if (!updateGradeStructure) {
        count++;
        continue;
      }
      gradesStructures.push(updateGradeStructure);
    }

    if (count == model.length) {
      throw new HttpException(400, `Error when delete`);
    }

    return gradesStructures;
  }
}

export default GradeStructureService;
