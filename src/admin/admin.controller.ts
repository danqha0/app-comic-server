import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadChapter(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('title')
    title: string,
    @Body('content')
    content: string,
  ) {
    const data = await this.adminService.uploadImage(files);
    return {
      data: data,
      title: title,
      content: content,
    };
  }
}
