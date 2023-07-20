import { ObjectId } from 'mongoose';

export type BaseUserType = {
  _id: ObjectId;
  email: string;
};
