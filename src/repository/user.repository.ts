import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // Create a new user document
  async create(doc: UserDocument): Promise<UserDocument> {
    const createdEntity = new this.userModel(doc);
    return await createdEntity.save();
  }

  // Find a user document by ID
  async findById(id: string, option?): Promise<UserDocument | null> {
    return this.userModel.findById(id, option).exec();
  }

  // Find user documents that match the given filter
  async getByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<UserDocument[]> {
    return this.userModel.find(filter, field, option).populate(populate);
  }

  // Find all user documents
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Perform an aggregation query on the user documents
  async aggregate(option: any): Promise<any> {
    return this.userModel.aggregate(option).exec();
  }

  // Populate the given user documents with the given data
  async populate(result: UserDocument[], option: any): Promise<UserDocument[]> {
    return this.userModel.populate(result, option);
  }

  // Delete a user document by ID
  async deleteOne(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  // Delete multiple user documents by ID
  async deleteMany(ids: string[]): Promise<any> {
    return this.userModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  // Delete user documents that match the given filter
  async deleteByCondition(filter: any): Promise<any> {
    return this.userModel.deleteMany(filter).exec();
  }

  // Find user documents that match the given filter and update them with the given data
  async findByConditionAndUpdate(
    filter: any,
    update: any,
  ): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(filter, update).exec();
  }

  // Find a user document by ID and update it with the given data
  async findByIdAndUpdate(
    id: string,
    update: any,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, update).exec();
  }
}
