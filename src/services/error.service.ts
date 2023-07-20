import { ErrorLogFilter } from '@/interfaces/errors.interface';
import { ErrorModel } from '@/models/errors.model';
import { CreateErrorLogType, ErrorLogType } from '@/types/errors.types';
import { Service } from 'typedi';

@Service()
export class ErrorService {
  public async createErrorLog(data: CreateErrorLogType): Promise<ErrorLogType> {
    const createErrorObject = await ErrorModel.create(data);
    const errorLog: ErrorLogType = createErrorObject.toObject();
    return errorLog;
  }

  public async getErrorLogById(id: string): Promise<ErrorLogType | null> {
    const errorLog = await ErrorModel.findById(id).exec();
    if (!errorLog) {
      throw new Error('Not Found');
    }
    return errorLog.toObject();
  }

  public async getAllErrorLogs(): Promise<ErrorLogType[]> {
    const errorLogs = await ErrorModel.find().exec();
    return errorLogs.map((errorLog) => errorLog.toObject());
  }

  public async getErrorLogsWithFilter(
    filter: ErrorLogFilter,
  ): Promise<ErrorLogType[]> {
    const errorLogs = await ErrorModel.find(filter).exec();
    return errorLogs.map((errorLog) => errorLog.toObject());
  }

  public async deleteErrorLogById(id: string): Promise<boolean> {
    const result = await ErrorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new Error('Not Found');
    }
    return result.deletedCount === 1;
  }

  public async updateErrorResolvedStatus(
    id: string,
    resolved: boolean,
  ): Promise<ErrorLogType | null> {
    const errorLog = await ErrorModel.findById(id).exec();
    if (!errorLog) {
      throw new Error('Not Found');
    }
    errorLog.resolved = resolved;
    await errorLog.save();
    return errorLog.toObject();
  }
}
