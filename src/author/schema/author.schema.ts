import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Comic } from '../../comic/schema/comic.schema';
import { User } from '../../user/schema/user.schema';

export type AuthorDocument = Author & Document;

@Schema({
  timestamps: true,
})
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Comic' }] })
  series: Comic[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop()
  avata: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
