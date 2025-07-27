import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserTeamsDto } from './dto/create-user_team.dto';
import { RemoveUserTeamDto } from './dto/remove-user_team.dto';
import { UserTeamRepository } from './user_team.repository';

@Injectable()
export class UserTeamService {
  constructor(private readonly repository: UserTeamRepository) {}

  async create(payload: CreateUserTeamsDto) {
    try {
      // TODO: check if user is already in team
      const team = await this.repository.findOne({
        where: {
          team_id: payload.teams[0].team_id,
          user_id: payload.teams[0].user_id,
        },
      });

      return await this.repository.createUserTeam(payload);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async remove(payload: RemoveUserTeamDto) {
    return await this.repository.removeUserTeam(payload);
  }
}
