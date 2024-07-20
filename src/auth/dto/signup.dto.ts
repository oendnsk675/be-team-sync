import { IsEmail, IsString, IsInt } from 'class-validator';

export class ResponseSignupDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsInt()
  user_id: number;
}
