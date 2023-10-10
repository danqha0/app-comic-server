import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: mongoose.Types.ObjectId,
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

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Author' }] })
  follow: [mongoose.Types.ObjectId];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Comic' }] })
  subscribe: [mongoose.Types.ObjectId];

  @Prop({ default: false })
  vip: boolean;

  @Prop({
    default:
      'https://res.cloudinary.com/dnsskwfqr/image/upload/v1690290724/qnqp6t87xiexxxmu814e.webp',
  })
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
