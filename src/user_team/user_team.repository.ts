import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTeam } from './entities/user_team.entity';
import { CreateUserTeamsDto } from './dto/create-user_team.dto';
import { RemoveUserTeamDto } from './dto/remove-user_team.dto';

@Injectable()
export class UserTeamRepository extends Repository<UserTeam> {
  constructor(
    @InjectRepository(UserTeam)
    private repository: Repository<UserTeam>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async createUserTeam(payload: CreateUserTeamsDto) {
    return await this.repository.save(payload.teams);
  }

  async removeUserTeam({ user_id, team_id }: RemoveUserTeamDto) {
    return await this.repository.delete({
      user_id,
      team_id,
    });
  }
}
