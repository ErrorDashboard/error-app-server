import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { BaseUserDto, CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import passport from 'passport';

export class AuthRoute implements Routes {
  public path = '/v1/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(BaseUserDto, 'body'),
      this.auth.logIn,
    );

    this.router.post(`${this.path}/refresh-token`, this.auth.refreshToken);

    this.router.post('/logout', AuthMiddleware, this.auth.logOut);

    // Route for initiating GitHub authentication
    this.router.get(
      `${this.path}/github`,
      passport.authenticate('github', { session: false }),
    );

    // Route for handling the GitHub callback
    this.router.get(
      `${this.path}/github/callback`,
      passport.authenticate('github', {
        session: false,
        failureRedirect: '/login',
      }),
      this.auth.githubCallback,
    );

    // Route for initiating Google authentication
    this.router.get(
      `${this.path}/google`,
      passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        failureRedirect: '/login',
      }),
    );

    // Route for handling the Google callback
    this.router.get(
      `${this.path}/google/callback`,
      passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
      }),
      this.auth.googleCallback,
    );
  }
}
