import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Request,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import * as mongoose from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findById(@Request() req, @Res() res: Response) {
    try {
      const user = await this.usersService.findById(
        new mongoose.Types.ObjectId(req.user.id),
      );

      return res.status(HttpStatus.OK).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        password: user.password,
        coin: user.coin,
        follow: user.follow,
        subscribe: user.subscribe,
        vip: user.vip,
        avatar: user.avatar,
        isActive: user.isActive,
        email: user.email,
        accessToken: '',
        refreshToken: '',
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
    return;
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.usersService.update(
      new mongoose.Types.ObjectId(id),
      updateUser,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(new mongoose.Types.ObjectId(id));
  }

  @UseGuards(AccessTokenGuard)
  @Post('/subscribe')
  async subscribeComic(
    @Request() req,
    @Body('id') comicId: string,
    @Res() res: Response,
  ) {
    try {
      const subscriber = await this.usersService.subscribe(
        new mongoose.Types.ObjectId(req.user.id),
        comicId,
      );

      return res.status(HttpStatus.OK).json(subscriber);
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
