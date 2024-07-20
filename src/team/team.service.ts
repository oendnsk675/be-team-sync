import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateResponse } from './dto/create-response.dto';
import { TeamRepository } from './team.repository';
import { GetAllResponse } from './dto/get-all-response.dto';
import { Team } from './entities/team.entity';
import { UserRole } from 'src/common/enums/user-role';
import { EntityManager, In } from 'typeorm';
import { UserTeam } from 'src/user_team/entities/user_team.entity';
import { UserTeamRepository } from 'src/user_team/user_team.repository';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly userTeamRepository: UserTeamRepository,
  ) {}

  async create(createTeamDto: CreateTeamDto, user_id: number): Promise<any> {
    return await this.teamRepository.manager.transaction(
      async (manager: EntityManager) => {
        try {
          const team = await manager.save(Team, createTeamDto);

          const role: string = UserRole.AUTHOR;
          const userTeamData = {
            user_id,
            team_id: team.team_id,
            role,
          };

          await manager.save(UserTeam, userTeamData);

          return {
            message: 'Successfully create the team',
            data: team,
          };
        } catch (error) {
          throw new BadRequestException('Failed to create team and user team');
        }
      },
    );
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

  async remove(teamId: number) {
    await this.teamRepository.delete({ team_id: teamId });

    return {
      message: 'Successfull update data team',
    };
  }

  async getTotalTeam(userId: number) {
    try {
      const data = await this.userTeamRepository.count({
        where: { user_id: userId },
      });

      return {
        message: 'Successfully retrieve the total team',
        data: {
          total: data,
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async getTotalTeamMember(userId: number) {
    try {
      const teams = await this.userTeamRepository.find({
        where: {
          user_id: userId,
          role: In([UserRole.AUTHOR, UserRole.MAINTENER]),
        },
      });

      const filterMember = teams.filter((team) => team.user_id !== userId);
      const totalMember = filterMember.length;

      return {
        message: 'Successfully retrieve the total team',
        data: {
          total: totalMember,
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }
}
