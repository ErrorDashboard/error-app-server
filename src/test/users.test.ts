import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import { UserRoute } from '@routes/users.route';
import { UserService } from '@/services/users.service';
import Container from 'typedi';

describe('Testing Users', () => {
  let app: App;

  beforeEach(() => {
    const mockUserService = {
      findAllUser: jest.fn().mockResolvedValue([
        {
          _id: 'mock_id_1',
          email: 'mock1@example.com',
          password: 'mock_password_1',
        },
        {
          _id: 'mock_id_2',
          email: 'mock2@example.com',
          password: 'mock_password_2',
        },
      ]),
      findUserById: jest.fn().mockImplementation((id) => {
        return Promise.resolve({
          _id: id,
          email: 'mock1@example.com',
          password: 'mock_password_1',
        });
      }),
      createUser: jest.fn().mockResolvedValue({
        _id: 'mock_id_1',
        email: 'created@example.com',
        password: 'created_password',
      }),
      updateUser: jest.fn().mockImplementation((userId, userData) => {
        return Promise.resolve({
          _id: userId,
          email: 'updated@example.com',
          password: 'updated_password',
        });
      }),
      deleteUser: jest.fn().mockResolvedValue(true),
    };
    Container.set(UserService, mockUserService);
  });

  afterEach(() => {
    app.disconnectDatabase();
  });

  describe('[GET] /users', () => {
    it('should return all users', async () => {
      app = new App([new UserRoute()]);
      const response = await request(app.getServer()).get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('[GET] /users/:id', () => {
    it('should return a user by ID', async () => {
      const userId = 'mock_id_1';
      app = new App([new UserRoute()]);
      const response = await request(app.getServer()).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(userId);
    });
  });

  describe('[POST] /users', () => {
    it('should create a new user', async () => {
      const userData: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      app = new App([new UserRoute()]);
      const response = await request(app.getServer())
        .post('/users')
        .send(userData);
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('created@example.com');
    });
  });

  describe('[PUT] /users/:id', () => {
    it('should update a user by ID', async () => {
      const userId = 'mock_id_1';
      const userData: CreateUserDto = {
        email: 'update@example.com',
        password: 'updatepassword',
      };
      app = new App([new UserRoute()]);
      const response = await request(app.getServer())
        .put(`/users/${userId}`)
        .send(userData);
      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('updated@example.com');
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('should delete a user by ID', async () => {
      const userId = 'mock_id_1';
      app = new App([new UserRoute()]);
      const response = await request(app.getServer()).delete(
        `/users/${userId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
