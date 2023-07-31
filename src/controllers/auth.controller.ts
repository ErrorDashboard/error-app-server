import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { SECURE_COOKIE } from '@/config';
import { createCookie, generateAccessToken } from '@/utils/authTokens';

export class AuthController {
  public auth = Container.get(AuthService);

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { accessToken, refreshToken, user } = await this.auth.login(
        userData,
      );

      const accessCookie = createCookie(accessToken, 'Authorization');
      res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);

      const refreshCookie = createCookie(refreshToken, 'refresh-token');
      res.cookie(
        refreshCookie.name,
        refreshCookie.value,
        refreshCookie.options,
      );

      res.status(200).json({
        user: user,
        accessToken: accessToken,
        message: 'Successful Login',
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.cookie('Authorization', '', {
        httpOnly: true,
        secure: SECURE_COOKIE,
        expires: new Date(0),
      });

      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken;
      const { accessToken } = await this.auth.refreshAccessToken(refreshToken);
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  public githubCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user as User;
      const accessToken = generateAccessToken(user);
      const accessCookie = createCookie(accessToken, 'Authorization');

      res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);

      res.redirect(
        `http://${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/`,
      );
    } catch (error) {
      next(error);
    }
  };

  public googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user as User;
      const accessToken = generateAccessToken(user);
      const accessCookie = createCookie(accessToken, 'Authorization');

      res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);

      res.redirect(
        `http://${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/`,
      );
    } catch (error) {
      next(error);
    }
  };
}
