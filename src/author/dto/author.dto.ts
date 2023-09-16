import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAuthorDto {
  @IsNotEmpty() name: string;
  series: [];
  followers: [];
  avata: string;
}

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
