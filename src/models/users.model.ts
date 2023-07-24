import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Namespace } from './namespace.model';

@modelOptions({ schemaOptions: { collection: 'Users', timestamps: true } })
export class User {
  @prop({ type: String })
  public email?: string;

  @prop({ type: String, select: false })
  public password?: string;

  @prop({ type: String, unique: true, sparse: true })
  public googleId?: string;

  @prop({ type: String, unique: true, sparse: true })
  public githubId?: string;

  @prop({ ref: 'Namespace', type: mongoose.Schema.Types.ObjectId })
  public namespaces: Ref<Namespace>[];

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const UserModel = getModelForClass(User);
