import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comic, ComicSchema } from './schema/comic.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ChapterModule } from 'src/chapter/chapter.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ChapterModule,
    UserModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Comic.name, schema: ComicSchema }]),
  ],
  controllers: [ComicController],
  providers: [ComicService],
  exports: [ComicService],
})
export class ComicModule {}
