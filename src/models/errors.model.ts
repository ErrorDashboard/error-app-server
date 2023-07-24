import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Namespace } from './namespace.model';

class Component {
  @prop({ required: true })
  public path: string;

  @prop({ required: true })
  public line: number;
}

@modelOptions({
  schemaOptions: { collection: 'Errors', timestamps: true },
})
export class Errors {
  @prop({ type: Number, required: true })
  public statusCode: number;

  @prop({ type: String, required: true })
  public message: string;

  @prop({
    required: true,
  })
  public component: Component;

  @prop({ type: String })
  public userAffected?: string;

  @prop({ type: String, required: true })
  public stackTrace: string;

  @prop({ type: Boolean })
  public resolved: boolean;

  @prop({ ref: 'Namespace', type: mongoose.Schema.Types.ObjectId })
  public namespaces: Ref<Namespace>[];

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const ErrorModel = getModelForClass(Errors);
