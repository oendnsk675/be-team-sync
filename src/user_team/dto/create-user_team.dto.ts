import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserTeamDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  team_id: number;

  @IsString()
  role: string;

  @IsString()
  encrypted_key: string;

  @IsOptional()
  joined_at?: Date;
}

export class CreateUserTeamsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserTeamDto)
  teams: CreateUserTeamDto[];
}
