import { IsInt } from 'class-validator';

export class RemoveUserTeamDto {
  @IsInt()
  user_id: number;

  @IsInt()
  team_id: number;
}
