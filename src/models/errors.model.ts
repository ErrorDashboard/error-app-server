import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'Errors', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
class Errors {
  public _id: ObjectId;

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

  public createdAt?: Date;
  public updatedAt?: Date;
}

export const ErrorModel = getModelForClass(Errors);
