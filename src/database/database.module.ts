import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { UserSchema } from '../user/schema/user.schema';
import { AuthorSchema } from '../author/schema/author.schema';
import { ChapterSchema } from '../chapter/schema/chapter.schema';
import { ComicSchema } from '../comic/schema/comic.schema';
import { CommentSchema } from '../comment/schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: 'Comic', schema: ComicSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
