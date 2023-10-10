import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ComicModule } from 'src/comic/comic.module';
import { ChapterModule } from 'src/chapter/chapter.module';

@Module({
  imports: [ComicModule, ChapterModule],
  controllers: [AdminController],
  providers: [AdminService, CloudinaryService],
  exports: [AdminService],
})
export class AdminModule {}
