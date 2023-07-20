import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_SECRET_KEY } from '@config';
import { HttpException } from '@/exceptions/httpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

interface JwtPayload {
  _id: string;
  iat: number;
  exp: number;
}

const getAuthorization = (req) => {
  const cookie = req.cookies['Authorization'];
  const header = req.header('Authorization');
  return cookie || header || null;
};

export const AuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = getAuthorization(req);

    if (authorization) {
      const result = verify(authorization, ACCESS_SECRET_KEY) as JwtPayload;
      const findUser = await UserModel.findById(result._id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
