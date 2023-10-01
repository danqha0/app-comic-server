import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comic, ComicDocument } from './schema/comic.schema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class ComicService {
  constructor(
    @InjectModel(Comic.name) private comicModel: Model<ComicDocument>,
  ) {}

  async getComic(id: mongoose.Types.ObjectId): Promise<ComicDocument | null> {
    try {
      const comic = await this.comicModel.findById(id).exec();
      if (!comic) {
        throw new NotFoundException('Comic not found');
      }
      return comic;
    } catch (error) {
      throw new NotFoundException('Comic not found');
    }
  }
}
