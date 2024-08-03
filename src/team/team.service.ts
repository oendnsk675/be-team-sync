import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
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

  async findAll(page: number = 1, limit: number = 10): Promise<GetAllResponse> {
    try {
      const offset = (page - 1) * limit;

      // Query data dengan pagination
      const [teams, total] = await this.teamRepository.findAndCount({
        skip: offset,
        take: limit,
      });

      return {
        message: 'Successfully retrieved data teams',
        data: {
          data: teams,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async findAllMember(
    team_id: number,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const offset = (page - 1) * limit;

      const [users, total] = await this.userTeamRepository.findAndCount({
        where: { team_id },
        relations: ['user'],
        skip: offset,
        take: limit,
      });
      return {
        message: 'Successfully retrieved data members',
        data: {
          data: users,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
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

  async getTotalMember(userId: number, teamId: number) {
    try {
      const total = await this.userTeamRepository.count({
        where: {
          user_id: userId,
          team_id: teamId,
          role: In([UserRole.AUTHOR, UserRole.MAINTENER]),
        },
      });

      return {
        message: 'Successfullys retrieve the total team',
        data: {
          total,
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async getTotalUserActive(team_id: number) {
    try {
      // tinggal ambil semua user yg aktif berdasarkan team
      const totalUserActive = await this.userTeamRepository
        .createQueryBuilder('user_teams')
        .innerJoin('user_teams.user', 'users')
        .where('user_teams.team_id = :team_id', { team_id })
        .andWhere('users.status = :status', { status: true })
        .getCount();

      const totalUser = await this.userTeamRepository.count({
        where: { team_id },
      });

      return {
        message: 'Succesfully retrieve total user active.',
        data: {
          totalUserActive,
          totalUser,
        },
      };
    } catch (error) {
      console.log(error);

      throw new BadGatewayException();
    }
  }
}
