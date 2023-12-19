import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { MailService } from 'src/mail/mail.service';
import { CachingService } from 'src/caching/caching.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  ForgotPassDto,
  LoginUserDto,
  ChangePasswordDto,
  VerifyOTP,
} from './dto/auth.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailsService: MailService,
    private cachingService: CachingService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      console.log('aaas');
      // Check if user exists
      const userExistsUsername = await this.userService.findByUsername(
        createUserDto.username,
      );
      const userExistsEmail = await this.userService.findByEmail(
        createUserDto.email,
      );

      if (userExistsUsername || userExistsEmail) {
        throw new BadRequestException('User already exists');
      }

      // Hash password
      const hash = await this.hashData(createUserDto.password);
      const newUser = await this.userService.create({
        name: createUserDto.name,
        email: createUserDto.email,
        username: createUserDto.username.toLocaleLowerCase(),
        password: hash,
      });
      const tokens = await this.getTokens(newUser._id, newUser.email);
      await this.updateRefreshToken(newUser._id, tokens.refreshToken);
      return {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        coin: newUser.coin,
        follow: newUser.follow,
        subscribe: newUser.subscribe,
        vip: newUser.vip,
        avatar: newUser.avatar,
        isActive: newUser.isActive,
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException('Register Fail');
    }
  }

  async signIn(data: LoginUserDto) {
    try {
      // Check if user exists
      const user = await this.userService.findByUsername(data.username);
      if (!user)
        throw new UnauthorizedException('Username or Password is incorrect');
      const passwordMatches = await bcrypt.compareSync(
        data.password,
        user.password,
      );
      if (!passwordMatches)
        throw new UnauthorizedException('Username or Password is incorrect');
      const tokens = await this.getTokens(user._id, user.email);
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        coin: user.coin,
        follow: user.follow,
        subscribe: user.subscribe,
        vip: user.vip,
        avatar: user.avatar,
        isActive: user.isActive,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Username or Password is incorrect');
    }
  }

  async changePass(id: mongoose.Types.ObjectId, data: ChangePasswordDto) {
    try {
      if (data.newPass != data.comfirmNewPass) {
        throw new UnauthorizedException('Passwords do not match');
      }
      const user = await this.userService.findById(id);
      if (!user)
        throw new UnauthorizedException('Username or Password is incorrect');
      const passwordMatches = await bcrypt.compareSync(
        data.oldPass,
        user.password,
      );
      if (!passwordMatches) {
        throw new UnauthorizedException('Old Password is incorrect');
      }
      const hash = await this.hashData(data.newPass);
      return await this.userService.update(id, {
        password: hash,
      });
    } catch (error) {
      throw new UnauthorizedException('Password is incorrect');
    }
  }

  async forgotPass(data: ForgotPassDto) {
    try {
      const user = await this.userService.findByUsername(data.username);
      if (!user) throw new UnauthorizedException('Username not find');
      const email = user.email;

      const generateOTP = () => {
        const min = 1000; // Giá trị nhỏ nhất của mã OTP (1000)
        const max = 9999; // Giá trị lớn nhất của mã OTP (9999)
        const otp = Math.floor(Math.random() * (max - min + 1)) + min;
        return otp.toString();
      };
      const otp = generateOTP();
      await this.cachingService.setOTP(data.username, otp);
      await this.mailsService.sendMail(email, otp);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Username or Password is incorrect');
    }
  }

  async verifyOTP(data: VerifyOTP) {
    try {
      const OTP = await this.cachingService.getOTP(data.username);
      if (OTP == data.OTP) {
        console.log(OTP == data.OTP);

        return await this.getToken(data.username);
      } else {
        throw new UnauthorizedException('OTP is not correct');
      }
    } catch (error) {
      throw new UnauthorizedException('OTP is not valid');
    }
  }

  async logout(userId: mongoose.Types.ObjectId) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, Number(process.env.SALT_OR_ROUNDS));
  }

  async updateRefreshToken(
    userId: mongoose.Types.ObjectId,
    refreshToken: string,
  ) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: mongoose.Types.ObjectId, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: process.env.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  async getToken(username: string) {
    const accessToken = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
        },
        {
          secret: process.env.JWT_SECRET_TOKEN_PASS,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      token: `Bearer ${accessToken}`,
    };
  }
}
