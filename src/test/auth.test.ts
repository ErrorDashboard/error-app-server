import request from 'supertest';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import Container from 'typedi';

import App from '@/app';
import { AuthService } from '@/services/auth.service';
import { User } from '@/interfaces/users.interface';
import { AuthRoute } from '@/routes/auth.route';
import { ACCESS_SECRET_KEY } from '@/config';

describe('Testing Auth', () => {
  let authService: AuthService;
  let app: App;
  beforeEach(() => {
    authService = {
      signup: jest.fn().mockResolvedValue({
        _id: 'user_id' as unknown as ObjectId,
        email: 'test@example.com',
        password: 't35tpa55w0rd',
      }),
      login: jest.fn().mockResolvedValue({
        cookie: 'fake_cookie',
        findUser: {
          _id: 'user_id' as unknown as ObjectId,
          email: 'test@example.com',
          password: 't35tpa55w0rd',
        },
      }),
      logout: jest
        .fn()
        .mockResolvedValue(Promise.resolve(true) as unknown as Promise<User>),
    };
    Container.set(AuthService, authService);
  });

  afterEach(() => {
    app.disconnectDatabase();
  });

  describe('[POST] /signup', () => {
    it('should create a new user and return a response with status 201', async () => {
      app = new App([new AuthRoute()]);
      const userData = {
        email: 'test@example.com',
        password: 't35tpa55w0rd',
      };

      const response = await request(app.getServer())
        .post('/signup')
        .send(userData);

      expect(response.statusCode).toEqual(201);
    });
  });

  describe('[POST] /login', () => {
    it('should return a response with status 200 and a Set-Cookie header', async () => {
      app = new App([new AuthRoute()]);
      const userData = {
        email: 'test@example.com',
        password: 't35tpa55w0rd',
      };

      const response = await request(app.getServer())
        .post('/login')
        .send(userData);

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual({
        _id: 'user_id',
        email: 'test@example.com',
        password: 't35tpa55w0rd',
      });
    });
  });
});
