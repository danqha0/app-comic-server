import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class CommentSche {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId; // Thêm trường _id vào schema

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Comic' })
  comicId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Owner' }] })
  userLikes: [mongoose.Types.ObjectId];
}

export const CommentSchema = SchemaFactory.createForClass(CommentSche);

export type CommentDocument = CommentSche & Document;
