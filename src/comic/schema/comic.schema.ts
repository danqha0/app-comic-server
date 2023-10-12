import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ComicDocument = Comic & Document;

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
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId; // Thêm trường _id vào schema

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  thumbImg: string;

  @Prop({ type: [String], required: true })
  previewImg: [string];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Chapter' }] })
  chapters: [mongoose.Types.ObjectId];

  @Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Author' } })
  author: mongoose.Types.ObjectId;

  @Prop({
    type: [
      { type: Number, default: 0, min: 0, max: 5 },
      { type: mongoose.Types.ObjectId, default: null, ref: 'User' },
    ],
  })
  rate: [
    {
      rate: number;
      userId: mongoose.Types.ObjectId;
    },
  ];

  @Prop({ type: String, enum: Genre, required: true })
  genre: Genre;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }] })
  comment: [mongoose.Types.ObjectId];

  @Prop()
  totalViews: number;

  @Prop()
  totalRates: number;
}

export const ComicSchema = SchemaFactory.createForClass(Comic);
