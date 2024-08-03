import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  username?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  password?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  fullname?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  role?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
