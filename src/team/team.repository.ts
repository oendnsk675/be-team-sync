import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamRepository extends Repository<Team> {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {
    super(
      teamRepository.target,
      teamRepository.manager,
      teamRepository.queryRunner,
    );
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const user = this.teamRepository.create(createTeamDto);
    return await this.teamRepository.save(user);
  }

  async findTeam(team_id: number): Promise<Team> {
    return await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.userTeams', 'userTeam')
      .leftJoinAndSelect('userTeam.user', 'user')
      .select([
        'team.team_id',
        'team.team_name',
        'team.description',
        'userTeam.role',
        'userTeam.joined_at',
        'user.user_id',
        'user.username',
        'user.email',
      ])
      .where('team.team_id = :team_id', { team_id })
      .getOne();
  }
}