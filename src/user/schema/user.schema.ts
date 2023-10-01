import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Comic } from '../../comic/schema/comic.schema';
import { Author } from '../../author/schema/author.schema';

export type UserDocument = User & Document;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId; // Thêm trường _id vào schema

  @Prop({ required: true, unique: true, lowercase: true })
  username: string;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 0, min: 0 })
  coin: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }] })
  like: Comic[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }] })
  subscribe: Author[];

  @Prop({ default: false })
  vip: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
