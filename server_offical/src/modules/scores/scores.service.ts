import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import ScoreSchema from './scores.model';
import CreateScoreDto from './dtos/create.dto';
import UpdateScoreDto from './dtos/update.dto';
import ScoreInterface from './scores.interface';
import { ObjectStudentId, UserSchema } from '@modules/users';
import { ClassroomSchema } from '@modules/classrooms';
import GradeStructureSchema from '@modules/grade_structure/grade_structure.model';
import readXlsxFile from "read-excel-file/node";
import excel, { Workbook } from "exceljs";

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
    let count = 0;
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
        count++;
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

    if (count == model.length) {
      throw new HttpException(400, `Data already exist`);
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

  public async uploadScoresOfListStudents(
    userId: string,
    classId: string,
    file: any,
  ): Promise<Array<ScoreInterface>> {
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

    let path = global.__filename + file.filename;
    path = path.replace("..", "");
    path = path.replace("/src", "/uploads");

    const listGradesStructure = await GradeStructureSchema.find({classroom: classId}).sort({ordinal: 1});

    let count = 0;
    let countScoreExist = 0;

    readXlsxFile(path).then((rows: any) => {
      // skip header
      rows.shift();

      let listStudents: any = [];

      rows.forEach((row: any) => {
        let flag = 0;
        this.scoreSchema.findOne({
          studentId:row[0],
          classId: classId,
          gradesStructId: listGradesStructure[count]._id,
        }).then(scoresTemp => {
          if (scoresTemp) {
            countScoreExist++;
            flag = 1;
          }
        });
       
        if (flag == 0) {
          let scores = {
            name: listGradesStructure[count].name,
            studentId: row[0],
            classId: classId,
            gradesStructureId: listGradesStructure[count]._id,
            score: row[1],
            ordinal: listGradesStructure[count].ordinal,
            createAt: Date.now(),
            updateAt: Date.now(),
          };
  
          listStudents.push(scores);
        }

        count++;
      });

      if (countScoreExist == count) {
        throw new HttpException(400, `Data already exist`);
      }

      this.scoreSchema.create(
        listStudents
      ).then(createScore => {
        if (!createScore) throw Error(`Fail to import data into database!`);
        return createScore
      });
    })

    throw Error(`Fail to import data into database!`);
  }

  public async downloadFileTemplateListScoresOfStudents(
    classId: string,
  ): Promise < Workbook > {
    // const listGradesOfStudents = [];

    const listGrades = await GradeStructureSchema.find({classroom: classId}).sort({ordinal: 1});
    let structGrades: {[k: string]: any} = {
      studentId: "18127076"
    };
    let liststructColWorksheet = [{ header: "studentId", key: "studentId", width: 10 }];
    listGrades.forEach((grades) => {
      structGrades[grades.name] = 100;

      const structColWorksheet = {
        header: grades.name,
        key: grades.name,
        width: 20
      }

      liststructColWorksheet.push(structColWorksheet);
    });

    let workbook: Workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("ListStudents");

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
