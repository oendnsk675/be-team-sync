import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateResponse } from './dto/create-response.dto';
import { TeamRepository } from './team.repository';
import { GetAllResponse } from './dto/get-all-response.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async create(createTeamDto: CreateTeamDto): Promise<CreateResponse> {
    const team = await this.teamRepository.createTeam(createTeamDto);

    return {
      message: 'Successfully create the team',
      data: team,
    };
  }

  async findAll(): Promise<GetAllResponse> {
    const teams: Team[] = await this.teamRepository.find();
    return {
      message: 'Successfull retrieve data teams',
      data: teams,
    };
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findTeam(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return {
      message: 'Successfull retrieve data team',
      data: team,
    };
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    await this.teamRepository.update(id, updateTeamDto);
    return {
      message: 'Successfull update data team',
    };
  }

  async remove(team_id: number) {
    await this.teamRepository.delete({ team_id });

    return {
      message: 'Successfull update data team',
    };
  }
}
