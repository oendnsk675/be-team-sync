import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  team_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
