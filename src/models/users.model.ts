import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
class User {
  public _id: ObjectId;

  @prop({ type: String })
  public email?: string;

  @prop({ type: String, select: false })
  public password?: string;

  @prop({ type: String, unique: true, sparse: true })
  public googleId?: string;

  @prop({ type: String, unique: true, sparse: true })
  public githubId?: string;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const UserModel = getModelForClass(User);
