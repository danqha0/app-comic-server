import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chapter } from '../../chapter/schema/chapter.schema';

enum Genre {
  Action = 'Action',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Romance = 'Romance',
  Horror = 'Horror',
  Fantasy = 'Fantasy',
  ShortStory = 'ShortStory',
  Superhero = 'Superhero',
  Zombie = 'Zombie',
  Supernatural = 'Supernatural',
  Animals = 'Animals',
  Crime_Mystery = 'Crime/Mystery',
  Sci_fi = 'Sci_fi',
  Historical = 'Historical',
  Informative = 'Informative',
  Sports = 'Sports',
  All_Ages = 'All Ages',
}

@Schema({
  timestamps: true,
})
export class Comic {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  thumbImg: string;

  @Prop({ required: true })
  avatarComicImg: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Chapter' })
  chapters: Chapter[];

  @Prop({ type: [{ type: Number, default: 0, min: 0, max: 5 }] })
  rate: number[];

  @Prop({ type: String, enum: Genre })
  type: Genre;
}

export const ComicSchema = SchemaFactory.createForClass(Comic);

export type UserDocument = Comic & Document;
