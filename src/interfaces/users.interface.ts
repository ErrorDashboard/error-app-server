import { ObjectId } from 'mongoose';

export interface User {
  _id: ObjectId;
  email?: string;
  password?: string;
  googleId?: string;
  githubId?: string;
}

export interface ShortUser {
  _id: ObjectId;
  email: string;
}
