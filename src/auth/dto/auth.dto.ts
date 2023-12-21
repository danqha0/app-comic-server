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
  @IsNotEmpty() username: string;
  @IsNotEmpty() password: string;
}

export class ForgotPassDto {
  @IsNotEmpty() username: string;
}

export class ChangePasswordDto {
  @IsNotEmpty() oldPass: string;
  @IsNotEmpty() newPass: string;
  @IsNotEmpty() comfirmNewPass: string;
}

export class VerifyOTP {
  @IsNotEmpty() OTP: string;
  @IsNotEmpty() username: string;
}
