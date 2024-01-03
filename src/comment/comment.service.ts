import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CommentDocument, CommentSche } from './schema/comment.schema';
import { CreateCommentDto } from './dto/comment.dto';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentSche.name)
    private commentModel: mongoose.Model<CommentDocument>,
  ) {}

  async create(createUserDto: CreateCommentDto): Promise<CommentDocument> {
    try {
      const newUser = new this.commentModel({
        ...createUserDto,
      });

      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Error creating comment');
    }
  }

  async findById(id: mongoose.Types.ObjectId): Promise<CommentDocument | null> {
    try {
      const user = await this.commentModel
        .findById(id, '-createdAt -updatedAt -__v')
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Comment not found');
    }
  }

  async findByListId(
    ids: mongoose.Types.ObjectId[],
  ): Promise<CommentDocument[]> {
    try {
      const users = await this.commentModel
        .find(
          {
            _id: { $in: ids },
          },
          '-createdAt -updatedAt -__v',
        )
        .exec();
      return users;
    } catch (error) {
      throw new NotFoundException('Comments not found');
    }
  }
}
