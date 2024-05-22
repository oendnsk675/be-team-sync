import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  username: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsString()
  @Length(1, 255)
  fullname: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  avatar?: string;

  @IsString()
  @Length(1, 255)
  role: string;
}
