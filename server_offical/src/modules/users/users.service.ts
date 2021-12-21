import UserSchema from './users.model';
import RegisterDto from './dtos/register.dto';
import { DataStoredInToken, TokenData } from '@modules/auth';
import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exception';
import gravatar from 'gravatar';
import bcryptjs from 'bcryptjs';
import { IUser, ObjectStudentId } from './users.interface';
import UpdateDto from './dtos/update.dto';
import { generateJwtToken, randomTokenString } from '@core/utils/helpers';
import { RefreshTokenSchema } from '@modules/refresh_token';
// import ClassroomService from "@modules/classrooms/classrooms.service";
import { Classroom, ClassroomSchema } from '@modules/classrooms';

class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await this.userSchema
      .findOne({ account_name: model.account_name })
      .exec();
    if (user) {
      throw new HttpException(
        409,
        `Your account_name ${model.account_name} already exist`
      );
    }

    const avatar = gravatar.url(model.email!, {
      size: '200',
      rating: 'g',
      default: 'mm',
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(model.password!, salt);

    const createdUser: IUser = await this.userSchema.create({
      ...model,
      reg_type: 0,
      password: hashedPassword,
      avatar: avatar,
      create_at: Date.now(),
    });
    const refreshToken = await this.generateRefreshToken(createdUser._id);
    await refreshToken.save();

    return generateJwtToken(createdUser._id, refreshToken.token);
  }

  public async updateUser(userId: string, model: UpdateDto): Promise<IUser> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await this.userSchema
      .findOne({ _id: userId, isBlocked: 0 })
      .exec();
    if (!user) {
      throw new HttpException(400, `User is not exists`);
    }

    let updateUserById;

    if (model.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(model.password, salt);
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          update_at: new Date(),
          password: hashedPassword,
        })
        .exec();
    } else {
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          update_at: new Date(),
        })
        .exec();
    }

    if (!updateUserById) {
      throw new HttpException(409, 'You are not an user');
    }

    const user_updated = await this.userSchema.findById(userId).exec();
    if (!user_updated) {
      throw new HttpException(404, `User is not exists`);
    }

    return user_updated;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userSchema.findOne({ email: email }).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    return user;
  }

  public async mappingStudentIdWithAccount(
    studentId: string,
    userId: string,
    classroomId: string
  ): Promise<IUser> {
    const user = await this.userSchema.findOne({ _id: userId }).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    // const classroomService = new ClassroomService();
    const classroom = await ClassroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(404, `Classroom is not exists`);
    }

    for (let i = 0; i < classroom.participants_id.length; i++) {
      const userInClass = await this.userSchema
        .findById(classroom.participants_id[i])
        .exec();
      if (userInClass) {
        for (let i = 0; i < userInClass.list_object_studentId.length; i++) {
          let ObjectStudentId = userInClass.list_object_studentId[0];

          let classInArray = ObjectStudentId.classroomId;
          let studentIdInArray = ObjectStudentId.studentId;
          if (classInArray == classroomId && studentIdInArray == studentId) {
            throw new HttpException(409, 'Mssv already exist in classroom');
          }
        }
      }
    }

    if (user.user_type === 1) {
      throw new HttpException(400, `User is teacher`);
    }

    let list_object_studentId_temp = user.list_object_studentId;
    list_object_studentId_temp.push({
      classroomId: classroomId,
      studentId: studentId,
    });

    const updateUserById = await this.userSchema
      .findByIdAndUpdate(
        userId,
        {
          list_object_studentId: list_object_studentId_temp,
        },
        { new: true }
      )
      .exec();

    if (!updateUserById) {
      throw new HttpException(409, 'Error when mapping');
    }

    return updateUserById;
  }

  private async generateRefreshToken(userId: string) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
  public async blockUserById(
    userId: string,
    userBlockId: string
  ): Promise<IUser> {
    const admin = await this.userSchema
      .findOne({ _id: userBlockId, isBlocked: 0 })
      .exec();
    if (!admin) {
      throw new HttpException(400, ' User is not Exist');
    }
    if (admin.user_type === 1) {
      throw new HttpException(400, `User is teacher`);
    }
    if (admin.user_type === 0) {
      throw new HttpException(400, 'User is Student');
    }
    const user = await this.userSchema
      .findOneAndUpdate(
        { _id: userId, isBlocked: 0 },
        {
          isBlocked: 1,
        }
      )
      .exec();
    if (!user) {
      throw new HttpException(400, `User is not exists`);
    }
    return user;
  }
  public async unMappStudentIdOfAccount(
    studentId: string,
    memberId: string,
    adminId: string,
    classroomId: string
  ): Promise<IUser> {
    const student = await this.userSchema
      .findOne({ _id: memberId, isBlocked: 0 })
      .exec();
    if (!student) {
      throw new HttpException(404, `User is not exists`);
    }

    // const classroomService = new ClassroomService();
    const classroom = await ClassroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(404, `Classroom is not exists`);
    }
    const user = await this.userSchema
      .findOne({ _id: adminId, isBlocked: 0 })
      .exec();
    if (!user) {
      throw new HttpException(404, `Admin is not exists`);
    }
    if (user.user_type !== 2) {
      throw new HttpException(400, `User is not admin`);
    }

    const updateUser = await this.userSchema
      .findOneAndUpdate(
        { _id: studentId },
        {
          $pull: {
            list_object_studentId: {
              classroomId: classroomId,
              studentId: studentId,
            },
          },
        },
        { new: true }
      )
      .exec();

    if (!updateUser) {
      throw new HttpException(409, 'Can  not unMapp');
    }

    return updateUser;
  }
}

export default UserService;
