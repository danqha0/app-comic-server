import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ComicModule } from 'src/comic/comic.module';

@Module({
  imports: [ComicModule],
  controllers: [AdminController],
  providers: [AdminService, CloudinaryService],
  exports: [AdminService],
})
export class AdminModule {}
