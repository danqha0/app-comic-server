import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCommentDto {
  @IsNotEmpty() userId: string;
  @IsNotEmpty() content: string;
  userLikes: [];
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
