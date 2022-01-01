import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import ScoreSchema from './scores.model';
import CreateScoreDto from './dtos/create.dto';
import UpdateScoreDto from './dtos/update.dto';
import ScoreInterface from './scores.interface';
import { ObjectStudentId, UserSchema } from '@modules/users';
import { ClassroomSchema } from '@modules/classrooms';
import GradeStructureSchema from '@modules/grade_structure/grade_structure.model';
import readXlsxFile from 'read-excel-file/node';
import excel, { Workbook } from 'exceljs';

class ScoreService {
  public scoreSchema = ScoreSchema;

  public async create(
    userId: string,
    classId: string,
    model: CreateScoreDto
  ): Promise<ScoreInterface> {
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

    const gradesStructure = await GradeStructureSchema.findById(
      model.gradesStructId
    ).exec();
    if (!gradesStructure) {
      throw new HttpException(404, `gradesStructure is not exists`);
    }

    const gradesTemp = await this.scoreSchema
      .findOne({
        studentId: model.studentId,
        classId: classId,
        gradesStructId: model.gradesStructId,
      })
      .exec();
    if (gradesTemp) {
      throw new HttpException(400, `Data already exist`);
    }

    const createScore = await this.scoreSchema.create({
      ...model,
      classId: classId,
      name: gradesStructure.name,
      ordinal: gradesStructure.ordinal,
      createAt: Date.now(),
      updateAt: Date.now(),
    });

    return createScore;
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

    const listScores = <any>(
      await this.scoreSchema
        .find({ classId: classId, studentId: studentId })
        .sort({ ordinal: 1 })
    );

    if (!listScores) {
      throw new HttpException(409, `Scores is not exist`);
    }

    return listScores;
  }

  public async showTotalScoreByStudentId(
    userId: string,
    studentId: string,
    classId: string
  ): Promise<number> {
    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }

    const listScores = await this.scoreSchema
      .find({ classId: classId, studentId: studentId })
      .sort({ ordinal: 1 });
    if (!listScores) {
      throw new HttpException(409, `Scores is not exist`);
    }

    let total = 0;
    for (let i = 0; i < listScores.length; i++) {
      let gradesStruct = await GradeStructureSchema.findById(
        listScores[i].gradesStructId
      );
      if (!gradesStruct) {
        throw new HttpException(400, `Score is not exist`);
      }
      total += (listScores[i].score * gradesStruct.maxScore) / 100;
    }

    return total;
  }

  public async update(
    userId: string,
    model: UpdateScoreDto
  ): Promise<ScoreInterface> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student `);
    }

    const updateGrades = await this.scoreSchema.findByIdAndUpdate(
      model._id,
      {
        ...model,
        updateAt: new Date(),
      },
      { new: true }
    );
    if (!updateGrades) {
      throw new HttpException(409, `_Id is not exist`);
    }

    return updateGrades;
  }

  public async uploadScoresOfListStudents(
    userId: string,
    classId: string,
    file: any
  ): Promise<string> {
    if (file == undefined) {
      throw new HttpException(409, `Please upload an excel file!`);
    }

    const user = await UserSchema.findById(userId).exec();
    const classes = await ClassroomSchema.findById(classId).exec();
    if (!user || !classes) {
      throw new HttpException(404, `User is not exists or Class is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student`);
    }

    let scores = await this.scoreSchema.deleteMany({
      classId: classId,
    });

    let path = global.__filename + file.filename;
    path = path.replace('..', '');
    path = path.replace('src', '/uploads');

    const listGradesStructure = await GradeStructureSchema.find({
      classroom: classId,
    }).sort({ ordinal: 1 });

    let rows = await readXlsxFile(path);
    rows.shift();

    for (let i = 0; i < rows.length; i++) {
      let count = 0;
      let countScoreExist = 0;
      let student: any = [];

      for (let k = 0; k < listGradesStructure.length; k++) {
        const row: any = rows[i];

        let flag = 0;
        let scores = await this.scoreSchema.findOne({
          studentId: row[0],
          classId: classId,
          gradesStructId: listGradesStructure[count]._id,
        });

        if (scores) {
          countScoreExist++;
          flag = 1;
        }

        if (flag == 0) {
          let scores = {
            name: listGradesStructure[count].name,
            studentId: row[0],
            classId: classId,
            gradesStructId: listGradesStructure[count]._id.toHexString(),
            score: row[k + 1],
            ordinal: listGradesStructure[count].ordinal,
            createAt: Date.now(),
            updateAt: Date.now(),
          };

          student.push(scores);
        }
        count++;
      }

      if (countScoreExist == count) {
        throw new HttpException(400, `Data already exist`);
      }

      // console.log(listStudents);
      const createScore = await this.scoreSchema.create(student);

      // if (!createScore) throw Error(`Fail to import data into database!`)
    }

    return `Uploaded the file successfully: ${file.originalname}`;
  }

  public async downloadFileTemplateListScoresOfStudents(
    classId: string
  ): Promise<Workbook> {
    // const listGradesOfStudents = [];

    const listGrades = await GradeStructureSchema.find({
      classroom: classId,
    }).sort({ ordinal: 1 });
    let structGrades: { [k: string]: any } = {
      studentId: '18127076',
    };
    let liststructColWorksheet = [
      { header: 'studentId', key: 'studentId', width: 10 },
    ];
    listGrades.forEach((grades) => {
      structGrades[grades.name] = 100;

      const structColWorksheet = {
        header: grades.name,
        key: grades.name,
        width: 20,
      };

      liststructColWorksheet.push(structColWorksheet);
    });

    let workbook: Workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('ListStudents');

    // worksheet.columns = [
    //   { header: "studentId", key: "studentId", width: 10 },
    //   { header: "fullName", key: "fullName", width: 30 },
    // ];
    worksheet.columns = liststructColWorksheet;

    // Add Array Rows
    worksheet.addRows([structGrades]);

    return workbook;
  }
}

export default ScoreService;
