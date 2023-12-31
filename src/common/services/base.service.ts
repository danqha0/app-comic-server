import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const created = new this.model(createDto);
    return (await created.save()) as T;
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    return await this.model.findOne({ _id: id }).exec();
  }

  async update(id: string, updateDto: any): Promise<T> {
    return await this.model.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async delete(id: string): Promise<T> {
    return await this.model.findByIdAndRemove(id);
  }
}
