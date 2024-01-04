import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ComicService } from 'src/comic/comic.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import * as mongoose from 'mongoose';
import { CreateCommentDto, PostCommentDto } from './dto/comment.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private comicService: ComicService,
  ) {}

  @Get('comic/:id')
  async GetCommentsComic(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const listCommentsId = await this.comicService.getComic(
        new mongoose.Types.ObjectId(id),
      );
      const comments = await this.commentService.findByListId(
        listCommentsId.comment,
      );
      const data = await Promise.all(
        comments.map(async (comment) => {
          const { name, avatar } = await this.userService.findById(
            new mongoose.Types.ObjectId(comment.userId),
          );
          return {
            name,
            avatar,
            content: comment.content,
            commentId: comment._id,
          };
        }),
      );
      return res.status(HttpStatus.OK).json({
        comments: data,
      });
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

  @UseGuards(AccessTokenGuard)
  @Post('')
  async AddComment(
    @Body() body: PostCommentDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.user;
      const comicId = new mongoose.Types.ObjectId(body.comicId);
      const userId = new mongoose.Types.ObjectId(id);

      const createComment: CreateCommentDto = { ...body, userId: id };

      const [listCommentsId, comment, user] = await Promise.all([
        this.comicService.getComic(comicId),
        this.commentService.create(createComment),
        this.userService.findById(userId),
      ]);

      user.comments.push(comment._id);
      listCommentsId.comment.push(comment._id);

      await Promise.all([
        this.userService.update(userId, user),
        this.comicService.update(comicId, listCommentsId),
      ]);

      const comments = await this.commentService.findByListId(
        listCommentsId.comment,
      );
      return res.status(HttpStatus.OK).json({ comments });
    } catch (error) {
      const status =
        error instanceof BadRequestException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({ message: error.message });
    }
  }
}
