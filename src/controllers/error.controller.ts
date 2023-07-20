import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { ErrorLogFilter } from '@interfaces/errors.interface';
import { ErrorService } from '@services/error.service';
import { CreateErrorLogType, ErrorLogType } from '@/types/errors.types';

export class ErrorController {
  public errorService = Container.get(ErrorService);

  public createErrorLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const ErrorLog: CreateErrorLogType = req.body;
      ErrorLog.resolved = false;
      await this.errorService.createErrorLog(ErrorLog);
      res.status(201).json({ data: 'Successfully Created' });
    } catch (error) {
      next(error);
    }
  };

  public getErrorLogById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.errorId;
      const data: ErrorLogType = await this.errorService.getErrorLogById(id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getAllErrorLogs = async (
    _: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: ErrorLogType[] = await this.errorService.getAllErrorLogs();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getErrorLogsWithFilter = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const filter: ErrorLogFilter = req.query;
      const data: ErrorLogType[] =
        await this.errorService.getErrorLogsWithFilter(filter);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public deleteErrorLogById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.errorId;
      await this.errorService.deleteErrorLogById(id);
      res.status(202).json({ data: 'Successfully Deleted' });
    } catch (error) {
      next(error);
    }
  };
}
