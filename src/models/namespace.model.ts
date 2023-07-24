import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './users.model';
import { Errors } from './errors.model';

@modelOptions({ schemaOptions: { collection: 'Namespaces', timestamps: true } })
export class Namespace {
  @prop({ type: String })
  public serviceName: string;

  @prop({ type: String })
  public environmentType: string;

  @prop({ type: Boolean })
  public active: boolean;

  @prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  public users: Ref<User>[];

  @prop({ ref: 'Errors', type: mongoose.Schema.Types.ObjectId })
  public errorRecords: Ref<Errors>[];

  @prop({ type: String, default: () => uuidv4() })
  public clientId: string;

  @prop({ type: String, default: () => crypto.randomBytes(32).toString('hex') })
  public clientSecret: string;

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const NamespaceModel = getModelForClass(Namespace);
