import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Namespace } from './namespace.model';

@modelOptions({
  schemaOptions: { collection: 'Errors', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Errors {
  public _id: mongoose.Types.ObjectId;

  @prop({ type: Number, required: true })
  public statusCode: number;

  @prop({ type: String, required: true })
  public message: string;

  @prop({
    required: true,
    type: Schema.Types.Mixed,
  })
  public component: { path: string; line: number };

  @prop({ type: String })
  public userAffected: string;

  @prop({ type: String, required: true })
  public stackTrace: string;

  @prop({ type: Boolean })
  public resolved: boolean;

  @prop({ ref: () => Namespace, type: mongoose.Types.ObjectId })
  public namespaces: Ref<Namespace>[];

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const ErrorModel = getModelForClass(Errors);
