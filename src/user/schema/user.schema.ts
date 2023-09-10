import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Comic } from '../../database/schema/comic.schema';
import { Author } from '../../database/schema/author.schema';

export type UserDocument = User & Document;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
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
