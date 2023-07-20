import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { BaseUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/v1/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.user.getUserData);
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(BaseUserDto, 'body'),
      this.user.signUp,
    );
    this.router.get(`${this.path}/:id`, this.user.getUserById);
    this.router.put(
      `${this.path}/:id`,
      ValidationMiddleware(BaseUserDto, 'body', true),
      this.user.updateUser,
    );
    this.router.delete(`${this.path}/:id`, this.user.deleteUser);
  }
}
