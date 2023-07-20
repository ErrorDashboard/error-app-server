import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { ObjectId } from 'mongoose';
import { SECURE_COOKIE } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { generateAccessToken } from '@/utils/authTokens';

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
      res.status(200).json({ user, accessToken, message: 'Successful Login' });
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
      const { accessToken, cookie, user } = await this.user.signup(userData);

      res.cookie('refresh-token', cookie, {
        httpOnly: true,
        secure: SECURE_COOKIE,
      });
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
