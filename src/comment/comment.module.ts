import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSche, CommentSchema } from './schema/comment.schema';
import { UserModule } from 'src/user/user.module';
import { ComicModule } from 'src/comic/comic.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentSche.name, schema: CommentSchema },
    ]),
    UserModule,
    ComicModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
