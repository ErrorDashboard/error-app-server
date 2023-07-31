import { User } from '@/interfaces/users.interface';
import { ErrorLogType } from './errors.types';
import { type ObjectId } from 'mongoose';
import { Ref } from '@typegoose/typegoose';

export type BaseNamespaceType = {
  serviceName: string;
  environmentType: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateNamespaceType = Partial<BaseNamespaceType>;

export type FullNamespaceType = BaseNamespaceType & {
  clientId: string;
  clientSecret: string;
  users: Ref<User | ObjectId>[];
  errorRecords: Ref<ErrorLogType | ObjectId>[];
};
