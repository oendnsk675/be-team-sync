import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserTeamsDto } from './dto/create-user_team.dto';
import { UserTeamRepository } from './user_team.repository';
import { RemoveUserTeamDto } from './dto/remove-user_team.dto';

@Injectable()
export class UserTeamService {
  constructor(private readonly repository: UserTeamRepository) {}

  async create(payload: CreateUserTeamsDto) {
    try {
      return await this.repository.createUserTeam(payload);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(payload: RemoveUserTeamDto) {
    return await this.repository.removeUserTeam(payload);
  }
}
