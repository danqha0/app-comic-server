import { IsNotEmpty } from 'class-validator';

export class CreateCryptedDto {
  @IsNotEmpty() publicToken: string;
  @IsNotEmpty() privateToken: string;
}
