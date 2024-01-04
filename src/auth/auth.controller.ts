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
import {
  CreateUserDto,
  LoginUserDto,
  ChangePasswordDto,
  ForgotPassDto,
  VerifyOTP,
} from './dto/auth.dto';
import * as mongoose from 'mongoose';
import { PassTokenStrategy } from './strategies/passToken.strategy';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

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
      return res.status(HttpStatus.OK).json({
        _id: tokens._id,
        username: tokens.username,
        name: tokens.name,
        email: tokens.email,
        password: tokens.password,
        coin: tokens.coin,
        follow: tokens.follow,
        subscribe: tokens.subscribe,
        vip: tokens.vip,
        avatar: tokens.avatar,
        isActive: tokens.isActive,
        accessToken: '',
        refreshToken: '',
      });
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

  @Post('forgotPass')
  async forgotPass(@Body() updateUser: ForgotPassDto, @Res() res: Response) {
    try {
      await this.authService.forgotPass(updateUser);
      return res.status(HttpStatus.OK).json({
        message: 'OTP had sent to your email address',
      });
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

  @Post('forgotPass/verifyOTP')
  async verifyOTP(@Body() updateUser: VerifyOTP, @Res() res: Response) {
    try {
      const token = await this.authService.verifyOTP(updateUser);
      return res.status(HttpStatus.OK).json({
        token: token,
      });
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

  @Post('forgotPass/changepassword')
  async changePasswordForgot(
    @Body() updateUser: ChangePasswordDto,
    @Res() res: Response,
  ) {
    try {
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
