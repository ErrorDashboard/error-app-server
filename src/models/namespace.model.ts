import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './users.model';
import { Errors } from './errors.model';

@modelOptions({ schemaOptions: { collection: 'namespaces', timestamps: true } })
export class Namespace {
  public _id: mongoose.Types.ObjectId;

  @prop({ type: String })
  public serviceName: string;

  @prop({ type: String })
  public environmentType: string;

  @prop({ type: Boolean })
  public active: boolean;

  @prop({ ref: () => User, type: mongoose.Types.ObjectId })
  public users: Ref<User>[];

  @prop({ ref: () => Errors, type: mongoose.Types.ObjectId })
  public errors: Ref<Errors>[];

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const NamespaceModel = getModelForClass(Namespace);
