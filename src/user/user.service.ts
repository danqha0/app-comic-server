import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const newUser = new this.userModel({
        ...createUserDto,
      });

      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find({}, '-createdAt -updatedAt -__v').exec();
    } catch (error) {
      throw new NotFoundException('Error fetching users');
    }
  }

  async findById(id: mongoose.Types.ObjectId): Promise<UserDocument | null> {
    try {
      const user = await this.userModel
        .findById(id, '-createdAt -updatedAt -__v')
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    try {
      return await this.userModel
        .findOne({ username }, '-createdAt -updatedAt -__v')
        .exec();
    } catch (error) {
      throw new NotFoundException('Error fetching user by username');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new NotFoundException('Error fetching user by email');
    }
  }

  async update(
    id: mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto | any,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: mongoose.Types.ObjectId): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        return null;
      }
      user.isActive = false;
      await user.save();
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async subscribe(userId: mongoose.Types.ObjectId, comicID: string) {
    try {
      const user = await this.userModel.findOne(
        { _id: userId },
        '-createdAt -updatedAt -__v',
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const subscribeIndex = user.subscribe.findIndex(
        (comic) => comic.toString() === comicID,
      );

      if (subscribeIndex >= 0) {
        user.subscribe.splice(subscribeIndex, 1);
      } else {
        user.subscribe.push(new mongoose.Types.ObjectId(comicID));
      }

      const updateUser = await user.save();
      return updateUser;
    } catch (error) {
      throw new BadRequestException('Error subscribing to comic');
    }
  }
}
