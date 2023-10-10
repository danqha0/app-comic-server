import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PostChapterComicDto {
  @IsNotEmpty() titleChapter: string;
  @IsNotEmpty() chapterNumber: number;
  @IsNotEmpty() idComic: string;
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
