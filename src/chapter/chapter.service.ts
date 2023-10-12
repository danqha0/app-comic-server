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

  async createChapter(
    chapterCreate: CreateChapterDto,
  ): Promise<ChapterDocument> {
    try {
      const newChapter = new this.chapterModel({ ...chapterCreate });
      const createChapter = await newChapter.save();
      return createChapter;
    } catch (err) {
      throw new BadRequestException('Create Chapter Fail');
    }
  }

  async getChapter(id: mongoose.Types.ObjectId): Promise<ChapterDocument> {
    try {
      const chapter = await this.chapterModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      return chapter;
    } catch (error) {
      throw new NotFoundException('Chapter not found');
    }
  }

  async getChapterByListId(
    ids: mongoose.Types.ObjectId[],
  ): Promise<ChapterDocument[]> {
    const chapters = await Promise.all(
      ids.map(async (id) => {
        const chapter = await this.chapterModel.findById(
          id,
          '-createdAt -updatedAt -__v',
        );
        if (!chapter) {
          throw new NotFoundException(`Chapter not found for ID: ${id}`);
        }
        return chapter;
      }),
    );

    return chapters;
  }

  async getAllChapter(
    id: mongoose.Types.ObjectId[],
  ): Promise<ChapterDocument[]> {
    try {
      const chapters = await this.chapterModel.find(
        id,
        '-createdAt -updatedAt -__v',
      );
      return chapters;
    } catch (error) {
      throw new NotFoundException('Chapters not found');
    }
  }

  async increaseView(id: mongoose.Types.ObjectId) {
    try {
      const chapter = await this.chapterModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      chapter.view++;
      await chapter.save();
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async getView(id: mongoose.Types.ObjectId) {
    try {
      const chapter = await this.chapterModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      return chapter.view;
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async likeOrUnlike(id: mongoose.Types.ObjectId, userId: string) {
    try {
      const chapter = await this.chapterModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      const likeIndex = chapter.like.findIndex(
        (user) => user.toString() === userId,
      );
      if (likeIndex >= 0) {
        chapter.like.splice(likeIndex, 1);
      } else {
        chapter.like.push(new mongoose.Types.ObjectId(id.toString()));
      }

      const updateChapter = await chapter.save();

      return updateChapter;
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async deleteChapter(id: mongoose.Types.ObjectId) {
    try {
      const chapter = await this.chapterModel.findOne(
        { _id: id },
        '-createdAt -updatedAt -__v',
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      await this.chapterModel.deleteOne({ _id: id });
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }

  async deleteManyChapter(id: mongoose.Types.ObjectId[]) {
    try {
      await this.chapterModel.deleteMany({ _id: { $in: id } });
    } catch (error) {
      throw new BadRequestException('Chapter not found');
    }
  }
}
