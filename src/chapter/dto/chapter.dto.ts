import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PostChapterComicDto {
  @IsNotEmpty() titleChapter: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty()
  chapterNumber: number;
}

export class CreateChapterDto {
  @IsNotEmpty()
  titleChapter: string;

  @IsNotEmpty()
  image: any[string];

  @IsNotEmpty()
  chapterNumber: number;

  @IsNotEmpty()
  thumbChapter: string;

  like: [];
  view: number;
}

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
