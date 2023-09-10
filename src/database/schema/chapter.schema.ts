import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { CommentSche } from './comment.schema';

@Schema({
  timestamps: true,
})
export class Chapter {
  @Prop([String])
  image: string[];

  @Prop({ required: true })
  chapterNumber: number;

  @Prop({ required: true })
  titleChapter: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  like: User[];

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Comment' })
  comment: CommentSche[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

export type UserDocument = Chapter & Document;
