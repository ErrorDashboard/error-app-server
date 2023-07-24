import { ObjectId } from 'mongoose';

export interface ShortUser {
  _id: ObjectId;
  email: string;
}

export interface User extends Partial<ShortUser> {
  password?: string;
  googleId?: string;
  githubId?: string;
}
