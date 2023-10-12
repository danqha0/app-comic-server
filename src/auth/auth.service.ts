import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/auth.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
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
}
