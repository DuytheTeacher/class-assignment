import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import ScoreSchema from './scores.model';
import CreateScoreDto from './dtos/create.dto';
import UpdateScoreDto from './dtos/update.dto';
import ScoreInterface from './scores.interface';
import { ObjectStudentId, UserSchema } from '@modules/users';
import { ClassroomSchema } from '@modules/classrooms';
import GradeStructureSchema from '@modules/grade_structure/grade_structure.model';

class ScoreService {
  public scoreSchema = ScoreSchema;

  public async create(
    userId: string,
    classId: string,
    model: Array<CreateScoreDto>,
  ): Promise<Array<ScoreInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }

    let gradesArray = [];
    for (let i = 0; i < model.length; i++) {
      const gradesStructure = await GradeStructureSchema.findById(model[i].gradesStructId).exec();
      if (!gradesStructure) {
        throw new HttpException(404, `gradesStructure is not exists`);
      }

      // const student = await UserSchema.findById(model[i].studentId).exec();
      // if (!student) {
      //   throw new HttpException(404, `studentId is not exists`);
      // }

      // const objectStudentId = student.list_object_studentId.find(objectStudentId => objectStudentId.classroomId === classId);
      // if (!objectStudentId) {
      //   throw new HttpException(404, `classId is not exists in list_object_studentId`);
      // }

      const gradesTemp = await this.scoreSchema.findOne({
        studentId: model[i].studentId,
        classId: classId,
        gradesStructId: model[i].gradesStructId,
      }).exec();
      if (gradesTemp) {
        continue;
      }
      const createGrades: ScoreInterface =
        await this.scoreSchema.create({
          ...model[i],
          classId: classId,
          name: gradesStructure.name,
          // objectStudentId: objectStudentId,
          ordinal: gradesStructure.ordinal,
          createAt: Date.now(),
          updateAt: Date.now(),
        });
      gradesArray.push(createGrades);
    }
    return gradesArray;
  }

  public async listScoresByStudentId(
    userId: string,
    studentId: string,
    classId: string
  ): Promise<Array<ScoreInterface>> {
    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }

    const listScores = <any>await this.scoreSchema.find({classId: classId, studentId: studentId}).sort({ordinal: 1});

    if (!listScores) {
      throw new HttpException(409, `Scores is not exist`);
    }

    return listScores;
  }
  
  public async update(
    model: Array<UpdateScoreDto>,
  ): Promise<Array<ScoreInterface>> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }
    let gradesArray = [];
    for (let i = 0; i < model.length; i++) {
      const updateGrades = await this.scoreSchema.findByIdAndUpdate(model[i]._id,
        { 
          ...model[i],
          updateAt: new Date(),
        },
        { new: true }
      );
      if (!updateGrades) {
        continue;
      }
      gradesArray.push(updateGrades);
    }
    return gradesArray;
  }
}

export default ScoreService;
