import request from 'supertest';
import App from '@/app';
import { ErrorService } from '@/services/error.service';
import { CreateErrorLogType, ErrorLogType } from '@/types/errors.types';
import { ErrorLogFilter } from '@interfaces/errors.interface';
import Container from 'typedi';
import { ErrorRoute } from '@/routes/error.route';
import { ObjectId } from 'mongoose';

describe('Testing Error', () => {
  let app: App;

  beforeEach(() => {
    const mockErrorService = {
      createErrorLog: jest
        .fn()
        .mockResolvedValue({ data: 'Successfully Created' }),
      getErrorLogById: jest.fn().mockImplementation((id: ObjectId) => {
        return Promise.resolve(getMockErrorLog(id));
      }),
      getAllErrorLogs: jest.fn().mockResolvedValue(getAllMockErrorLogs()),
      getErrorLogsWithFilter: jest
        .fn()
        .mockImplementation((filter: ErrorLogFilter) => {
          return Promise.resolve([getFilteredMockErrorLogs(filter)]);
        }),
      deleteErrorLogById: jest
        .fn()
        .mockResolvedValue({ data: 'Successfully Deleted' }),
    };
    Container.set(ErrorService, mockErrorService);
  });

  afterEach(() => {
    app.disconnectDatabase();
  });

  describe('[POST] /error-logs', () => {
    it('should create a new error log', async () => {
      app = new App([new ErrorRoute()]);
      const createErrorLogData: CreateErrorLogType = {
        statusCode: 500,
        message: 'Internal Server Error',
        component: {
          path: 'app.js',
          line: 50,
        },
        userAffected: 'john@example.com',
        stackTrace: 'Error stack trace',
        resolved: false,
      };
      const response = await request(app.getServer())
        .post('/error-logs')
        .send(createErrorLogData);
      expect(response.status).toBe(201);
      expect(response.body.data).toBe('Successfully Created');
    });
  });

  describe('[GET] /error-logs/:errorId', () => {
    it('should return an error log by ID', async () => {
      app = new App([new ErrorRoute()]);
      const errorId = 'mock_error_id_1' as unknown as ObjectId;
      const response = await request(app.getServer()).get(
        `/error-logs/${errorId}`,
      );
      expect(response.status).toBe(200);
      const expectedLog = getMockErrorLog(errorId);
      expectedLog.createdAt = new Date(expectedLog.createdAt);
      expectedLog.updatedAt = new Date(expectedLog.updatedAt);
      expect(response.body.data._id).toEqual(expectedLog._id);
    });
  });

  describe('[GET] /error-logs', () => {
    it('should return all error logs', async () => {
      app = new App([new ErrorRoute()]);
      const response = await request(app.getServer()).get('/error-logs');
      expect(response.status).toBe(200);

      const expectedLogs = getAllMockErrorLogs();

      const receivedIds = response.body.data.map(
        (log: ErrorLogType) => log._id,
      );
      const expectedIds = expectedLogs.map((log: ErrorLogType) => log._id);

      expect(receivedIds).toEqual(expectedIds);
    });
  });

  describe('[GET] /error-logs/filter', () => {
    it('should return error logs with filter', async () => {
      app = new App([new ErrorRoute()]);
      const filter: ErrorLogFilter = {
        id: 'filter',
      };
      const response = await request(app.getServer())
        .get('/error-logs/filter')
        .query(filter);
      expect(response.status).toBe(200);
    });
  });

  describe('[DELETE] /error-logs/:errorId', () => {
    it('should delete an error log by ID', async () => {
      app = new App([new ErrorRoute()]);
      const errorId = 'mock_error_id_1';
      const response = await request(app.getServer()).delete(
        `/error-logs/${errorId}`,
      );
      expect(response.status).toBe(202);
      expect(response.body.data).toBe('Successfully Deleted');
    });
  });

  const getMockErrorLog = (id: ObjectId): ErrorLogType => {
    const curDate: Date = new Date();
    return {
      _id: id,
      statusCode: 500,
      message: 'Internal Server Error',
      component: {
        path: 'app.js',
        line: 50,
      },
      userAffected: 'john@example.com',
      stackTrace: 'Error stack trace',
      resolved: false,
      createdAt: curDate,
      updatedAt: curDate,
    };
  };

  const getAllMockErrorLogs = (): ErrorLogType[] => {
    return [
      getMockErrorLog('mock_error_id_1' as unknown as ObjectId),
      getMockErrorLog('mock_error_id_2' as unknown as ObjectId),
    ];
  };

  const getFilteredMockErrorLogs = (
    filter: ErrorLogFilter,
  ): ErrorLogType | null => {
    // Filter the mock error logs based on the provided filter criteria
    const errorLog = getAllMockErrorLogs().find(
      (log) =>
        (log._id as unknown as ObjectId) === (filter.id as unknown as ObjectId),
    );

    return errorLog || null;
  };
});
