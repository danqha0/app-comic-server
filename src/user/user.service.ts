import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashPassword,
    });

    const createdUser = await newUser.save();
    return createdUser;
  }

  async login(loginUser: LoginUserDto): Promise<UserDocument> {
    return this.userModel.findOne(loginUser);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: mongoose.Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto | any,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: mongoose.Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
