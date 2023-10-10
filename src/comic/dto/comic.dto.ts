import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import * as mongooes from 'mongoose';
import { Chapter } from 'src/chapter/schema/chapter.schema';
export class PostCreateComicDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  followers: [mongooes.Types.ObjectId];
  chapters: [mongooes.Types.ObjectId];
  rate: [];
  genre: string;
  comment: [];
}

export class CreateComicDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() thumbImg: string;
  @IsNotEmpty() previewImg: any[string];
  followers: [mongooes.Types.ObjectId];
  chapters: [mongooes.Types.ObjectId];
  rate: [];
  @IsNotEmpty() genre: string;
  comment: [];
}

export class ComicDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() thumbImg: string;
  @IsNotEmpty() previewImg: any[string];
  followers: [mongooes.Types.ObjectId];
  chapters: [mongooes.Types.ObjectId];
  rate: [];
  genre: string;
  comment: [];
  totalView: number;
}

export class ComicResponseDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() thumbImg: string;
  @IsNotEmpty() previewImg: any[string];
  followers: [mongooes.Types.ObjectId];
  chapters: [Chapter];
  rate: [];
  @IsNotEmpty() genre: string;
  comment: [];
  totalView: number;
}

export class ComicResponse {}

export class UpdateComicDto extends PartialType(CreateComicDto) {}
