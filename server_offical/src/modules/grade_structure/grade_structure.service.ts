import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import GradeSchema from './grade_structure.model';
import UpdateGradeStructureInterface from './dtos/updateGradeStructure';
import CreateGradeStructureInterface from './dtos/createGradeStructure';
import GradeStructureInterface from './grade_structure.interface';
import { UserSchema } from '@modules/users';
import { ClassroomSchema } from '@modules/classrooms';
import { _UpdateQuery } from 'mongoose';
class GradeStructureService {
  public GradeSchema = GradeSchema;

  public async create(
    userId: string,
    model: Array<CreateGradeStructureInterface>,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    // const userService = new UserService();
    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const gradestructure = await this.GradeSchema.findOne({
        name: model[i].name,
      }).exec();
      if (gradestructure) {
        throw new HttpException(
          409,
          `GradeStructure name ${model[i].name} already exist`
        );
      }
      const createGradeStructure: GradeStructureInterface =
        await this.GradeSchema.create({
          ...model[i],
          auth: userId,
          classroom: classId,
        });
      gradesStructures.push(createGradeStructure);
    }
    return gradesStructures;
  }

  public async listGrades(
    userId: string,
    classId: string
  ): Promise<Array<GradeStructureInterface>> {
    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }
    const listGrades = <any>await this.GradeSchema.find();

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
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const updateGradeStructure = await this.GradeSchema.findOneAndUpdate(
        {
          _id: model[i]._id,
          auth: userId,
          classroom: classId,
        },
        { ...model[i] },
        { new: true }
      );
      if (!updateGradeStructure) {
        throw new HttpException(
          409,
          `GradeStructure name ${model[i].name} already exist ,  not permission or can not found GradeStructure in Classroom `
        );
      }
      gradesStructures.push(updateGradeStructure);
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
    let gradesStructures = [];
    for (let i = 0; i < model.length; i++) {
      const updateGradeStructure = await this.GradeSchema.findOneAndDelete({
        _id: model[i]._id,
        name: model[i].name,
        auth: userId,
        classroom: classId,
      });
      if (!updateGradeStructure) {
        throw new HttpException(
          409,
          `GradeStructure name ${model[i].name} already exist ,  not permission or can not found GradeStructure in Classroom `
        );
      }
      gradesStructures.push(updateGradeStructure);
    }
    return gradesStructures;
  }
}

export default GradeStructureService;
