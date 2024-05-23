import { IsString } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class CreateResponse {
  @IsString()
  message: string;

  data: CreateTeamDto;
}
