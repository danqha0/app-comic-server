import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as mongoose from 'mongoose';
import { Response } from 'express';
import { PostCreateComicDto } from 'src/comic/dto/comic.dto';
import { ComicService } from 'src/comic/comic.service';
import { ChapterService } from 'src/chapter/chapter.service';
import { PostChapterComicDto } from 'src/chapter/dto/chapter.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly comicService: ComicService,
    private readonly adminService: AdminService,
    private readonly chapterService: ChapterService,
  ) {}

  @Post('addcomic')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'preview', maxCount: 3 },
      { name: 'thumb', maxCount: 1 },
    ]),
  )
  async uploadComic(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: PostCreateComicDto,
    @Res() res: Response,
  ) {
    try {
      console.log(files);
      const thumbImage = files['thumb'];
      const previewImages = files['preview'];
      const thumbImageAll = await this.adminService.uploadImage(thumbImage[0]);
      const previewImagesAll =
        await this.adminService.uploadImages(previewImages);

      const newComic = await this.comicService.createComic({
        ...data,
        thumbImg: thumbImageAll.secure_url,
        previewImg: previewImagesAll.map((image) => image.secure_url),
      });

      return res.status(HttpStatus.OK).json(newComic);
    } catch (error) {
      console.log(error.message);
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

  @Post('addchapter')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'thumbChapter', maxCount: 1 },
    ]),
  )
  async uploadChapter(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: PostChapterComicDto,
    @Res() res: Response,
  ) {
    try {
      const thumbImageFile = files['thumbChapter'];
      const imagesChapterFile = files['images'];

      const thumbImageChapter = await this.adminService.uploadImage(
        thumbImageFile[0],
      );

      const imagesChapter =
        await this.adminService.uploadImages(imagesChapterFile);

      const newChapter = await this.chapterService.createChapter({
        ...data,
        thumbChapter: thumbImageChapter.secure_url,
        image: imagesChapter.map((image) => image.secure_url),
        like: [],
        view: 0,
      });

      await this.comicService.saveComic(
        new mongoose.Types.ObjectId(data.idComic),
        newChapter._id,
      );

      return res.status(HttpStatus.OK).json(newChapter);
    } catch (error) {
      console.log(error.message);
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

  @Post('deleteChapter')
  async deleteChapter(@Body('id') id: string, @Res() res: Response) {
    try {
      await this.chapterService.deleteChapter(new mongoose.Types.ObjectId(id));
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

  @Post('deleteComic')
  async deleteComic(@Body('id') id: string, @Res() res: Response) {
    try {
      const listChapter = await this.comicService.deleteComic(
        new mongoose.Types.ObjectId(id),
      );

      await this.chapterService.deleteManyChapter(listChapter);
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
