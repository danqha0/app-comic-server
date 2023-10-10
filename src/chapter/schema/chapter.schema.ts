import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Chapter {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId; // Thêm trường _id vào schema

  @Prop([String])
  image: string[];

  @Prop({ required: true })
  chapterNumber: number;

  @Prop({ required: true })
  titleChapter: string;

  @Prop({ required: true })
  thumbChapter: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  like: [mongoose.Types.ObjectId];

  @Prop({ default: 0, min: 0 })
  view: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

export type ChapterDocument = Chapter & Document;
