import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exception";
import ClassroomSchema from "./classrooms.model";
import CreateDto from "./dtos/create.dto";
import Classroom from "./classrooms.interface";
import { UserService } from "@modules/users";

class ClassroomService {
  public classroomSchema = ClassroomSchema;

  public async create(userId: string, model: CreateDto): Promise<Classroom> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const userService = new UserService();
    const user = await userService.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.type === 0) {
        throw new HttpException(400, `User is student`);
    }

    const classroom = await this.classroomSchema
      .findOne({ name: model.name })
      .exec();
    if (classroom) {
      throw new HttpException(
        409,
        `Classroom name ${model.name} already exist`
      );
    }

    const createClassroom: Classroom = await this.classroomSchema.create({
      ...model,
      auth_id: userId,
      participants_id: [userId],
      createTime: Date.now(),
    });

    return createClassroom;
  }
}

export default ClassroomService;
