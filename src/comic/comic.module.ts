import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comic, ComicSchema } from './schema/comic.schema';
import { AdminModule } from 'src/admin/admin.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    AdminModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Comic.name, schema: ComicSchema }]),
  ],
  controllers: [ComicController],
  providers: [ComicService],
  exports: [ComicService],
})
export class ComicModule {}
