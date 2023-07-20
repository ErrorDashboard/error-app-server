import { ObjectId } from 'mongoose';

export type ErrorLogType = {
  _id?: ObjectId;
  statusCode: number;
  message: string;
  component: { path: string; line: number };
  userAffected: string;
  stackTrace: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateErrorLogType = Partial<ErrorLogType>;
