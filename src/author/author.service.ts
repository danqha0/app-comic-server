import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Author, AuthorDocument } from './schema/author.schema';
import * as mongoose from 'mongoose';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name)
    private authorModel: mongoose.Model<AuthorDocument>,
  ) {}

  async create(createUserDto: CreateAuthorDto): Promise<AuthorDocument> {
    const createdUser = await new this.authorModel(createUserDto).save();
    return createdUser;
  }

  async findById(id: mongoose.Types.ObjectId): Promise<AuthorDocument> {
    return this.authorModel.findById(id);
  }

  async findByAll(): Promise<AuthorDocument[]> {
    return this.authorModel.find();
  }

  async update(
    id: string,
    updateUserDto: UpdateAuthorDto | any,
  ): Promise<AuthorDocument> {
    return this.authorModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async getAllSeries(id: string): Promise<[mongoose.Types.ObjectId]> {
    const data = await this.authorModel.findById(id).exec();
    return data.series;
  }

  async getAllFollowers(id: string): Promise<[mongoose.Types.ObjectId]> {
    const data = await this.authorModel.findById(id).exec();
    return data.followers;
  }
}
