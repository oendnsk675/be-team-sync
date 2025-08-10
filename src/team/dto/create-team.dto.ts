import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  team_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gck?: string;
}
