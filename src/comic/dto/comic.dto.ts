import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import * as mongooes from 'mongoose';
export class PostCreateComicDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  followers: [mongooes.Types.ObjectId];
  chapters: [mongooes.Types.ObjectId];
  rate: [];
  genre: string;
  comment: [];
  totalViews: number;
}

export class CreateComicDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() thumbImg: string;
  @IsNotEmpty() previewImg: any[string];
  followers: [mongooes.Types.ObjectId];
  chapters: [mongooes.Types.ObjectId];
  rate: [];
  genre: string;
  comment: [];
  totalViews: number;
}

export class UpdateComicDto extends PartialType(CreateComicDto) {}
