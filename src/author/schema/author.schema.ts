import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Comic } from '../../comic/schema/comic.schema';
import { User } from '../../user/schema/user.schema';

export type AuthorDocument = Author & Document;

@Schema({
  timestamps: true,
})
export class Author {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId; // Thêm trường _id vào schema

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Comic' }] })
  series: Comic[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop({
    default:
      'https://res.cloudinary.com/dnsskwfqr/image/upload/v1690290724/qnqp6t87xiexxxmu814e.webp',
  })
  avata: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
