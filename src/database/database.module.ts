import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { UserSchema } from '../user/schema/user.schema';
import { AuthorSchema } from './schema/author.schema';
import { ChapterSchema } from './schema/chapter.schema';
import { ComicSchema } from './schema/comic.schema';
import { CommentSchema } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthorSchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: 'Comic', schema: ComicSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
