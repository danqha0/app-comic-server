import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PostCommentDto {
  @IsNotEmpty() comicId: string;
  @IsNotEmpty() content: string;
  userLikes: [];
}

export class CreateCommentDto {
  @IsNotEmpty() comicId: string;
  @IsNotEmpty() content: string;
  @IsNotEmpty() userId: string;
  userLikes: [];
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
