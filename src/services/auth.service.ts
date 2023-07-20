import { compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { REFRESH_SECRET_KEY } from '@config';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { ShortUser, User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { BaseUserType } from '@/types/users.types';
import {
  generateAccessToken,
  generateRefreshToken,
  createCookie,
} from '@/utils/authTokens';

@Service()
export class AuthService {
  public async login(userData: User): Promise<{
    accessToken: TokenData;
    refreshToken: TokenData;
    user: BaseUserType;
  }> {
    const findUser: User = await UserModel.findOne({
      email: userData.email,
    }).select('+password');

    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`,
      );

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(409, 'Password is not matching');

    const userResponseData: ShortUser = {
      _id: findUser._id,
      email: findUser.email,
    };
    const accessTokenData = generateAccessToken(findUser);
    const refreshTokenData = generateRefreshToken(findUser);

    return {
      accessToken: accessTokenData,
      refreshToken: refreshTokenData,
      user: userResponseData,
    };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({
      _id: userData._id,
      email: userData.email,
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`,
      );

    return findUser;
  }

  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; cookie: string }> {
    const dataStoredInToken = verify(
      refreshToken,
      REFRESH_SECRET_KEY,
    ) as DataStoredInToken;

    const findUser = await UserModel.findById(dataStoredInToken._id);

    if (!findUser) {
      throw new HttpException(401, 'Refresh token is not valid');
    }

    const accessTokenData = generateAccessToken(findUser);
    const newRefreshToken = generateRefreshToken(findUser);
    const cookie = createCookie(newRefreshToken);

    return { accessToken: accessTokenData.token, cookie };
  }
}
