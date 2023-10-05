import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comic, ComicDocument } from './schema/comic.schema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateComicDto } from './dto/comic.dto';

@Injectable()
export class ComicService {
  constructor(
    @InjectModel(Comic.name) private comicModel: Model<ComicDocument>,
  ) {}

  async createComic(comicCreate: CreateComicDto) {
    try {
      const newComic = new this.comicModel({ ...comicCreate });
      const createdComic = await newComic.save();
      return createdComic;
    } catch (err) {
      throw new BadRequestException('Create Comic Fail');
    }
  }

  async getComic(id: mongoose.Types.ObjectId): Promise<ComicDocument> {
    try {
      const comic = await this.comicModel.findOne({ _id: id });
      if (!comic) {
        throw new NotFoundException('Comic not found');
      }
      return comic;
    } catch (error) {
      throw new NotFoundException('Comic not found');
    }
  }

  async getAllComic(): Promise<ComicDocument[]> {
    try {
      const comics = await this.comicModel.find();
      return comics;
    } catch (error) {
      throw new NotFoundException('Comics not found');
    }
  }

  async getComicByGenre(type: string): Promise<ComicDocument[]> {
    try {
      const comics = await this.comicModel.find({ type: type });
      if (!comics || comics.length === 0) {
        throw new NotFoundException('Comics not found');
      }
      return comics;
    } catch (error) {
      throw new NotFoundException('Comics not found');
    }
  }

  async deleteComic(id: mongoose.Types.ObjectId) {
    try {
      const comic = await this.comicModel.findOne({ _id: id });
      if (!comic) {
        throw new NotFoundException('Comic not found');
      }

      await this.comicModel.deleteOne({ _id: id });
      return comic.chapters;
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }
}
