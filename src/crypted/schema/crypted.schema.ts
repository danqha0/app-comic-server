import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Crypted {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  publicToken: string;

  @Prop({ type: String, required: true })
  privateToken: string;
}

export const CryptedSchema = SchemaFactory.createForClass(Crypted);

export type CryptedDocument = Crypted & Document;
