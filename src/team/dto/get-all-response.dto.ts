import { IsString } from 'class-validator';
import { Team } from '../entities/team.entity';

export class GetAllResponse {
  @IsString()
  message: string;

  data: Team[];
}
