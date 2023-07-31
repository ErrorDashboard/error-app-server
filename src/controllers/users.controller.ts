import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { type ObjectId } from 'mongoose';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { generateAccessToken } from '@/utils/authTokens';
import { createCookie } from '@/utils/authTokens';

export class UserController {
  public user = Container.get(UserService);

  public getUserData = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      const accessToken = generateAccessToken(user);
      res
        .status(200)
        .json({ user, accessToken, message: 'User Info Retrieved' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { accessToken, refreshToken, user } = await this.user.signup(
        userData,
      );

      const {
        name: accessCookieName,
        value: accessCookieValue,
        options: accessCookieOptions,
      } = createCookie(accessToken, 'Authorization');
      res.cookie(accessCookieName, accessCookieValue, accessCookieOptions);

      const {
        name: refreshCookieName,
        value: refreshCookieValue,
        options: refreshCookieOptions,
      } = createCookie(refreshToken, 'refresh-token');
      res.cookie(refreshCookieName, refreshCookieValue, refreshCookieOptions);

      res.status(200).json({
        user: user,
        accessToken: accessToken,
        message: 'Successful Registered and Logged In',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: ObjectId = req.params.id as unknown as ObjectId;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
