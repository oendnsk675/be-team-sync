import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';

class CreateUserTeamDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  team_id: number;

  @IsString()
  role: string;

  @IsOptional()
  joined_at?: Date;
}

export class CreateUserTeamsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserTeamDto)
  teams: CreateUserTeamDto[];
}
