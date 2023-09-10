import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schema/user.schema';

@Schema({
  timestamps: true,
})
export class CommentSche {
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  content: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
  userLikes: User[];
}

export const CommentSchema = SchemaFactory.createForClass(CommentSche);

export type UserDocument = CommentSche & Document;
