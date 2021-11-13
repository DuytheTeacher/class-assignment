import UserSchema from "./users.model";
import RegisterDto from "./dtos/register.dto";
import { DataStoredInToken, TokenData } from "@modules/auth";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exception";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./users.interface";
import jwt from "jsonwebtoken";
import UpdateDto from "./dtos/update.dto";
import { exceptions } from "winston";

class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
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
      size: "200",
      rating: "g",
      default: "mm",
    });

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(model.password!, salt);
    const createUser: IUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
      date: Date.now(),
    });

    return this.createToken(createUser);
  }

  public async updateUser(userId: string, model: UpdateDto): Promise<IUser> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findById(userId).exec();
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
          password: hashedPassword,
        })
        .exec();
    } else {
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
        })
        .exec();
    }

    if (!updateUserById) {
      throw new HttpException(409, "You are not an user");
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

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoredInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn: number = 3600;

    return {
      token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }
}

export default UserService;
