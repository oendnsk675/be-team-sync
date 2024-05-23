import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateUserTeamDto {
  @IsInt()
  user_id: number;

  @IsInt()
  team_id: number;

  @IsString()
  role: string;

  @IsOptional()
  joined_at?: Date;
}
