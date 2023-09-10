import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Comic } from './comic.schema';
import { User } from '../../user/schema/user.schema';

@Schema({
  timestamps: true,
})
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }] })
  series: Comic[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop()
  avata: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

export type UserDocument = Author & Document;
