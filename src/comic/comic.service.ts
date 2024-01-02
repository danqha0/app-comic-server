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
      console.log(err.message);
      throw new BadRequestException('Create Comic Fail');
    }
  }

  async saveComic(
    id: mongoose.Types.ObjectId,
    chapterId: mongoose.Types.ObjectId,
  ) {
    try {
      const comic = await this.comicModel.findById(id);
      if (!comic) {
        throw new BadRequestException('Comic not found');
      }
      comic.chapters.push(chapterId);
      await comic.save();
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException('Create Comic Fail');
    }
  }

  async getComic(id: mongoose.Types.ObjectId): Promise<ComicDocument> {
    try {
      const comic = await this.comicModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
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
      const comics = await this.comicModel.find(
        {},
        '-createdAt -updatedAt -__v',
      );
      return comics;
    } catch (error) {
      throw new NotFoundException('Comics not found');
    }
  }

  async getComicByGenre(type: string): Promise<ComicDocument[]> {
    try {
      const regex = new RegExp(type, 'i');
      const comics = await this.comicModel.find(
        { genre: { $regex: regex } },
        '-createdAt -updatedAt -__v',
      );
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

  async searchByName(name: string | null): Promise<ComicDocument[]> {
    try {
      const regex = new RegExp(name, 'i');
      const comics = await this.comicModel.find(
        {
          title: { $regex: regex },
        },
        '-createdAt -updatedAt -__v',
      );
      return comics;
    } catch (error) {
      throw new NotFoundException('Comic not found');
    }
  }
  async getNewestComics(limit: number): Promise<ComicDocument[]> {
    try {
      const newestComics = await this.comicModel
        .find({}, '-createdAt -updatedAt -__v')
        .sort({ createAt: -1 })
        .limit(limit)
        .exec();

      return newestComics;
    } catch (error) {
      // Xử lý lỗi
      throw error;
    }
  }
  async update(
    id: mongoose.Types.ObjectId,
    updateUserDto: any,
  ): Promise<ComicDocument | null> {
    try {
      const user = await this.comicModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
