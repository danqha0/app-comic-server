import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty() name: string;

  @Length(6)
  @IsNotEmpty()
  password: string;
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

export class ChangePasswordDto {
  @IsNotEmpty() oldPass: string;
  @IsNotEmpty() newPass: string;
  @IsNotEmpty() reNewPass: string;
}
