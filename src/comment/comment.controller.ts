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
      console.log(data);
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
      const listCommentsId = await this.comicService.getComic(
        new mongoose.Types.ObjectId(body.comicId),
      );
      const createComment: CreateCommentDto = { ...body, userId: req.user.id };
      const comment = await this.commentService.create(createComment);
      const user = await this.userService.findById(
        new mongoose.Types.ObjectId(req.user.id),
      );
      user.comments.push(comment._id);

      await this.userService.update(
        new mongoose.Types.ObjectId(req.user.id),
        user,
      );
      listCommentsId.comment.push(comment._id);
      await this.comicService.update(
        new mongoose.Types.ObjectId(body.comicId),
        listCommentsId,
      );
      const comments = await this.commentService.findByListId(
        listCommentsId.comment,
      );
      return res.status(HttpStatus.OK).json({
        comments: comments,
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
}
