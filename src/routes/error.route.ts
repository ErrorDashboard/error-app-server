import { Router } from 'express';
import { ErrorController } from '@controllers/error.controller';
import { CreateErrorDto, ErrorLogFilterDto } from '@dtos/errors.dto';
import { Routes } from '@interfaces/routes.interface';

import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class ErrorRoute implements Routes {
  public path = '/v1/error-logs';
  public router = Router();
  public errorController = new ErrorController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      ValidationMiddleware(CreateErrorDto),
      this.errorController.createErrorLog,
    );

    // Route to get an error log by Id
    this.router.get(
      `${this.path}/:errorId`,
      this.errorController.getErrorLogById,
    );

    // Route to get all error logs
    this.router.get(`${this.path}`, this.errorController.getAllErrorLogs);

    // Route to get error logs with filter
    this.router.get(
      `${this.path}/filter`,
      ValidationMiddleware(ErrorLogFilterDto, 'query'),
      this.errorController.getErrorLogsWithFilter,
    );

    // Route to delete an error log by Id
    this.router.delete(
      `${this.path}/:errorId`,
      this.errorController.deleteErrorLogById,
    );
  }
}
