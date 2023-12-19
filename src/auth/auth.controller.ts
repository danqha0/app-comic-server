import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  Request as requestt,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, ChangePasswordDto } from './dto/auth.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import * as mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.signUp(createUserDto);
      return res.status(HttpStatus.OK).json(tokens);
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

  @Post('signin')
  async signin(@Body() data: LoginUserDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.signIn(data);
      return res.status(HttpStatus.OK).json(tokens);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
      }
    }
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Post('changePassword')
  async changePassword(
    @requestt() req,
    @Body() updateUser: ChangePasswordDto,
    @Res() res: Response,
  ) {
    try {
      const tokens = await this.authService.changePass(
        new mongoose.Types.ObjectId(req.user.id),
        updateUser,
      );
      return res.status(HttpStatus.OK).json(tokens);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
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
