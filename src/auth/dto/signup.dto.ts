import { IsEmail, IsString, IsUrl, IsEnum, IsInt } from 'class-validator';

export class ResponseSignupDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsUrl()
  avatar: string;

  @IsEnum(['user', 'admin'])
  role: string;

  @IsInt()
  user_id: number;
}
