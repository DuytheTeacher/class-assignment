
import { DataStoredInToken, IUser, TokenData } from "@modules/auth";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exception";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import {UserSchema} from "@modules/users";
import jwt from "jsonwebtoken";
import LoginDto from "./auth.dto";

class AuthService {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ account_name: model.account_name }).exec();
    if (!user) {
      throw new HttpException(409, `Your account_name ${model.account_name} is not exist`);
    }

    const isMatchPassword = await bcryptjs.compare(model.password, user.password);
    if (!isMatchPassword) {
        throw new HttpException(400, 'Invalid password');
    }

    return this.createToken(user);
  }

  public async getCurrentLoginUser(userId: string): Promise<IUser> {
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

export default AuthService;