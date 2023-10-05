import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Res,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import * as mongoose from 'mongoose';
import { Response } from 'express';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get(':id')
  async getChapterById(@Param() params: string, @Res() res: Response) {
    try {
      const comic = await this.chapterService.getChapter(
        new mongoose.Types.ObjectId(params),
      );

      return res.status(HttpStatus.OK).json(comic);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
      }
    }
  }

  @Post('increview')
  async increView(@Body('id') id: string, @Res() res: Response) {
    try {
      await this.chapterService.increaseView(new mongoose.Types.ObjectId(id));

      return res.status(HttpStatus.OK);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
      }
    }
  }

  @Post('like')
  async likeOrUnlike(@Body('id') id: string, @Res() res: Response) {
    try {
      await this.chapterService.increaseView(new mongoose.Types.ObjectId(id));

      return res.status(HttpStatus.OK);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
      }
    }
  }
}
