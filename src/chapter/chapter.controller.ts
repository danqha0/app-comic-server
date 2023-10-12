import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Res,
  HttpStatus,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import * as mongoose from 'mongoose';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get(':id')
  async getChapterById(@Param('id') params: string, @Res() res: Response) {
    try {
      const comic = await this.chapterService.getChapter(
        new mongoose.Types.ObjectId(params),
      );
      await this.chapterService.increaseView(
        new mongoose.Types.ObjectId(params),
      );
      return res.status(HttpStatus.OK).json({
        _id: comic._id,
        image: comic.image,
        chapterNumber: comic.chapterNumber,
        titleChapter: comic.titleChapter,
        thumbChapter: comic.thumbChapter,
        view: comic.view,
        like: comic.like,
        comicId: params,
      });
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

  @UseGuards(AccessTokenGuard)
  @Post('like')
  async likeOrUnlike(
    @Request() req,
    @Body('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const chapterUpdate = await this.chapterService.likeOrUnlike(
        new mongoose.Types.ObjectId(id),
        req.user.id,
      );

      return res.status(HttpStatus.OK).json(chapterUpdate);
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
