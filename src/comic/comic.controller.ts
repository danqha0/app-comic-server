import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ComicService } from './comic.service';
import * as mongoose from 'mongoose';
import { Response } from 'express';
import { ChapterService } from 'src/chapter/chapter.service';
@Controller('comics')
export class ComicController {
  constructor(
    private readonly comicService: ComicService,
    private readonly chapterService: ChapterService,
  ) {}

  @Get(':id')
  async getComicById(@Param('id') params: string, @Res() res: Response) {
    try {
      const comic = await this.comicService.getComic(
        new mongoose.Types.ObjectId(params),
      );
      const viewPromises = comic.chapters.map(async (number) => {
        const view = await this.chapterService.getView(number);
        return view;
      });
      const views = await Promise.all(viewPromises);
      const totalView = views.reduce((acc, view) => acc + view, 0);
      comic.totalViews = totalView;
      const chaptersComic = await this.chapterService.getChapterByListId(
        comic.chapters,
      );
      const response = {
        _id: comic._id,
        title: comic.title,
        description: comic.description,
        thumbImg: comic.thumbImg,
        previewImg: comic.previewImg,
        chapters: chaptersComic,
        rate: comic.rate,
        genre: comic.genre,
        comment: comic.comment,
        totalViews: comic.totalViews,
      };

      return res.status(HttpStatus.OK).json(response);
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

  @Get('/get/all')
  async getAllComic(@Res() res: Response) {
    try {
      const listComic = await this.comicService.getAllComic();
      const viewPromises = listComic.map(async (comic) => {
        const chapterViews = await Promise.all(
          comic.chapters.map(async (number) => {
            const view = await this.chapterService.getView(number);
            return view;
          }),
        );
        const totalView = chapterViews.reduce((acc, view) => acc + view, 0);
        comic.totalViews = totalView;
        return comic;
      });
      const newListComic = await Promise.all(viewPromises);

      return res.status(HttpStatus.OK).json(newListComic);
    } catch (error) {
      console.log(error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
      });
    }
  }

  @Get('/genre/:genre')
  async getComicByGenre(@Param('genre') params: string, @Res() res: Response) {
    try {
      const listComic = await this.comicService.getComicByGenre(params);
      const viewPromises = listComic.map(async (comic) => {
        const chapterViews = await Promise.all(
          comic.chapters.map(async (number) => {
            const view = await this.chapterService.getView(number);
            return view;
          }),
        );
        const totalView = chapterViews.reduce((acc, view) => acc + view, 0);
        return { ...comic, totalView };
      });

      const newListComic = await Promise.all(viewPromises);
      return res.status(HttpStatus.OK).json(newListComic);
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
