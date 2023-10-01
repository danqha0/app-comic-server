import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() email: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
  @IsNotEmpty() rePassword: string;
}

export class UpdateUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
  @IsNotEmpty() rePassword: string;
}

export class LoginUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() password: string;
}
