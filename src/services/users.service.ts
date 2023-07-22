import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { BaseUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { ShortUser, User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { ObjectId } from 'mongoose';
import { ObjectId as toObjectId } from 'mongodb';
import {
  generateAccessToken,
  generateRefreshToken,
  createCookie,
} from '@/utils/authTokens';
import { TokenData } from '@/interfaces/auth.interface';

@Service()
export class UserService {
  public async findUserById(userId: string): Promise<User> {
    const uid = new toObjectId(userId);
    const findUser: User = await UserModel.findOne({ _id: uid });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async signup(
    userData: User,
  ): Promise<{ accessToken: TokenData; cookie: string; user: ShortUser }> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} already exists`,
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    const userResponseData = {
      _id: createUserData._id,
      email: createUserData.email,
    };
    const accessTokenData = generateAccessToken(createUserData);
    const refreshToken = generateRefreshToken(createUserData);
    const cookie = createCookie(refreshToken);

    return {
      accessToken: accessTokenData,
      cookie,
      user: userResponseData,
    };
  }

  public async updateUser(
    userId: ObjectId,
    userData: BaseUserDto,
  ): Promise<User> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email });
      if (findUser && findUser._id != userId)
        throw new HttpException(
          409,
          `This email ${userData.email} already exists`,
        );
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await UserModel.findByIdAndUpdate(userId, {
      userData,
    });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const uid = new toObjectId(userId);
    const deleteUserById: User = await UserModel.findByIdAndDelete(uid);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}
