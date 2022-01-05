import { isEmptyObject, Logger } from '@core/utils';
import { HttpException } from '@core/exception';
import ClassroomSchema from './classrooms.model';
import CreateDto from './dtos/create.dto';
import { Classroom, Student } from './classrooms.interface';
import { UserSchema } from '@modules/users';
import { IUser, ObjectStudentId } from '@modules/users/';
import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js';
import readXlsxFile from 'read-excel-file/node';
import excel, { Workbook } from 'exceljs';
class ClassroomService {
  public classroomSchema = ClassroomSchema;

  public async create(userId: string, model: CreateDto): Promise<Classroom> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await UserSchema.findOne({
      _id: userId,
      isBlocked: 0,
    }).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student`);
    }

    const classroom = await this.classroomSchema
      .findOne({
        name: model.name,
      })
      .exec();
    if (classroom) {
      throw new HttpException(
        409,
        `Classroom name ${model.name} already exist`
      );
    }

    const createClassroom: Classroom = await this.classroomSchema.create({
      ...model,
      auth: {
        auth_id: userId,
        name: `${user.last_name} ${user.first_name}`,
      },
      participants_id: [userId],
      createTime: Date.now(),
    });

    //xu ly user
    let class_list_id = user.class_list_id;
    //update user
    let updateUserById;
    class_list_id.push(createClassroom._id);
    updateUserById = await UserSchema.findByIdAndUpdate(userId, {
      class_list_id: class_list_id,
    });

    return createClassroom;
  }

  public async getDetail(classroomId: string): Promise<Classroom> {
    const classroom = await this.classroomSchema.findById(classroomId).exec();
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    return classroom;
  }

  public async listUserInClassroom(classroomId: string): Promise<Array<IUser>> {
    const listUser = <any>await this.classroomSchema
      .findOne({
        _id: classroomId,
      })
      .populate('participants_id')
      .select({
        user: 1,
      });
    if (!listUser) {
      throw new HttpException(409, `Classroom or User is not exist`);
    }

    return listUser;
  }

  public async listClassroom(): Promise<Array<Classroom>> {
    const listClassroom = <any>await this.classroomSchema.find();

    if (!listClassroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    return listClassroom;
  }

  public async listClassroomByUserId(
    userId: string
  ): Promise<Array<Classroom>> {
    // const userService = new UserService();
    const listClassroom = <any>await UserSchema.findOne({
      _id: userId,
      isBlocked: 0,
    })
      .populate('class_list_id')
      .select({
        classroom: 1,
      });
    if (!listClassroom) {
      throw new HttpException(409, `User or Classroom is not exist`);
    }

    return listClassroom;
  }

  public async joinInClassroom(
    encryptClassroomId: string,
    encryptUserId: string
  ): Promise<Classroom> {
    //Decode userId and classroomId
    const bytesUserId = CryptoJS.AES.decrypt(
      encryptUserId,
      process.env.SECRET_KEY!
    );
    const userId = bytesUserId.toString(CryptoJS.enc.Utf8);

    const bytesClassroomId = CryptoJS.AES.decrypt(
      encryptClassroomId,
      process.env.SECRET_KEY!
    );
    const classroomId = bytesClassroomId.toString(CryptoJS.enc.Utf8);

    //classroom
    const classroom = await this.classroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }
    let participants_id = classroom.participants_id;
    const IsExistInClassroom = participants_id.includes(userId);

    //user
    // const userService = new UserService();
    const user = await UserSchema.findOne({
      _id: userId,
      isBlocked: 0,
    }).exec();
    if (!user) {
      throw new HttpException(409, `User is not exist`);
    }
    let class_list_id = user.class_list_id;

    if (IsExistInClassroom === true) {
      throw new HttpException(409, `User already exist in classroom`);
    }

    //update classroom
    participants_id.push(userId);
    let updateClassroomById = await this.classroomSchema.findByIdAndUpdate(
      classroomId,
      {
        participants_id: participants_id,
      },
      {
        new: true,
      }
    );

    //update user
    class_list_id.push(classroomId);
    let updateUserById = await UserSchema.findByIdAndUpdate(userId, {
      class_list_id: class_list_id,
    });

    if (!updateClassroomById) {
      throw new HttpException(409, 'Error when update classroom');
    }

    return updateClassroomById;
  }

  public async createClassroomInvitationLink(
    classroomId: string,
    userId: string
  ): Promise<string> {
    const classroom = await this.classroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    let participants_id = classroom.participants_id;
    const IsExistInClassroom = participants_id.includes(userId);

    if (IsExistInClassroom === true) {
      throw new HttpException(409, `User already exist in classroom`);
    }
    const user = await UserSchema.findOne({ _id: userId, isBlocked: 0 }).exec();
    if (!user) {
      throw new HttpException(404, `User is not exist`);
    }
    if (user.user_type !== 1) {
      throw new HttpException(400, 'You can not invite');
    }
    const encryptUserId: string = CryptoJS.AES.encrypt(
      userId,
      process.env.SECRET_KEY!
    ).toString();
    const encryptclassroomId: string = CryptoJS.AES.encrypt(
      classroomId,
      process.env.SECRET_KEY!
    ).toString();
    //${process.env.ENDPOINT}
    return `http://localhost:5000/api/classrooms/join_in_classroom?userId=${encodeURIComponent(
      encryptUserId
    )}&classId=${encodeURIComponent(encryptclassroomId)}`;
  }

  public async sendClassroomInvitationLink(
    userId: string,
    mail: string,
    link: string
  ): Promise<string> {
    const transporter = nodemailer.createTransport({
      // config mail server
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL, //Tài khoản gmail vừa tạo
        pass: process.env.PASSWORD_GMAIL, //Mật khẩu tài khoản gmail vừa tạo
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: 'system classroom',
      to: mail,
      subject: 'DatDuyThanh',
      text: link, //Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
      // html: content //Nội dung html mình đã tạo trên kia :))
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        Logger.info(err);
        throw new HttpException(409, `Error when send mail: ${err}`);
      } else {
        Logger.info('Message sent: ' + info.response);
      }
    });

    return `Send mail success`;
  }

  public async uploadListStudents(file: any, classId: string): Promise<string> {
    if (file == undefined) {
      throw new HttpException(409, `Please upload an excel file!`);
    }

    let path = global.__filename + file.filename;
    path = path.replace('..', '');
    path = path.replace('src', '/uploads');

    let rows = await readXlsxFile(path);
    rows.shift();
    let listStudents: Array<Student> = [];

    for (let i = 0; i < rows.length; i++) {
      const row: any = rows[i];

      let student: Student = {
        student_id: row[0],
        full_name: row[1],
      };

      listStudents.push(student);
    }

    const updateClassroomById = await this.classroomSchema.findByIdAndUpdate(
      classId,
      {
        list_students_from_xlsx: listStudents,
      },
      {
        new: true,
      }
    );

    if (!updateClassroomById) throw Error(`Fail to import data into database!`);

    return `Uploaded the file successfully: ${file.originalname}`;
  }

  public async downloadFileTemplateListStudents(): Promise<Workbook> {
    const listStudents = [
      {
        studentId: '18127076',
        fullName: 'Lê Tiến Đạt',
      },
      {
        studentId: '18127090',
        fullName: 'Nguyễn Anh Duy',
      },
      {
        studentId: '18127091',
        fullName: 'Lê Minh Thành',
      },
    ];

    let workbook: Workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('ListStudents');

    worksheet.columns = [
      { header: 'studentId', key: 'studentId', width: 10 },
      { header: 'fullName', key: 'fullName', width: 30 },
    ];

    // Add Array Rows
    worksheet.addRows(listStudents);

    return workbook;
  }
}
export default ClassroomService;
