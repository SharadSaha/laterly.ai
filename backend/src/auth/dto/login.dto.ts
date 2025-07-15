import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  name?: string;
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
