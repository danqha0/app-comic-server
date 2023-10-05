import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChapterDto } from './dto/chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: mongoose.Model<ChapterDocument>,
  ) {}

  async createChapter(chapterCreate: CreateChapterDto) {
    try {
      const newComic = new this.chapterModel({ ...chapterCreate });
      const createdComic = await newComic.save();
      return createdComic;
    } catch (err) {
      throw new BadRequestException('Create Chapter Fail');
    }
  }

  async getChapter(id: mongoose.Types.ObjectId): Promise<ChapterDocument> {
    try {
      const comic = await this.chapterModel.findOne({ _id: id });
      if (!comic) {
        throw new NotFoundException('Chapter not found');
      }
      return comic;
    } catch (error) {
      throw new NotFoundException('Chapter not found');
    }
  }

  async getAllChapter(
    id: mongoose.Types.ObjectId[],
  ): Promise<ChapterDocument[]> {
    try {
      const comics = await this.chapterModel.find(id);
      return comics;
    } catch (error) {
      throw new NotFoundException('Chapters not found');
    }
  }

  async increaseView(id: mongoose.Types.ObjectId) {
    try {
      const comic = await this.chapterModel.findOne({ _id: id });
      if (!comic) {
        throw new NotFoundException('Chapter not found');
      }
      comic.view++;
      await comic.save();
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async likeOrUnlike(id: mongoose.Types.ObjectId) {
    try {
      const chapter = await this.chapterModel.findOne({ _id: id });
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      const userIdString = id.toString(); // Chuyển đổi id thành chuỗi

      const likeIndex = chapter.like.findIndex(
        (user) => user.toString() === userIdString,
      );
      if (likeIndex >= 0) {
        chapter.like.splice(likeIndex, 1);
      } else {
        chapter.like.push(new mongoose.Schema.Types.ObjectId(id.toString()));
      }

      await chapter.save();
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async deleteChapter(id: mongoose.Types.ObjectId) {
    try {
      const comic = await this.chapterModel.findOne({ _id: id });
      if (!comic) {
        throw new NotFoundException('Chapter not found');
      }
      await this.chapterModel.deleteOne({ _id: id });
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async deleteManyChapter(id: mongoose.Schema.Types.ObjectId[]) {
    try {
      await this.chapterModel.deleteMany({ _id: { $in: id } });
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }
}
