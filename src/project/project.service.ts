import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRepository } from 'src/team/team.repository';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly teamRepository: TeamRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const { teamId, ...projectData } = createProjectDto;

      // Dapatkan entitas Team berdasarkan teamId
      const team = await this.teamRepository.findOne({
        where: { team_id: teamId },
      });

      if (!team) {
        throw new BadRequestException('Team not found');
      }

      const payload = this.projectRepository.create({
        ...projectData,
        team,
      });

      await this.projectRepository.save(payload);

      return {
        message: 'Successfully create project',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(userId: number) {
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.team', 'team')
      .innerJoin('team.userTeams', 'userTeam')
      .where('userTeam.user_id = :userId', { userId })
      .select([
        'project.project_id',
        'project.project_name',
        'project.description',
        'project.startDate',
        'project.endDate',
        'project.createdAt',
        'project.updatedAt',
        'team.team_id',
        'team.team_name',
      ])
      .getMany();

    return {
      message: '',
      data,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const { affected } = await this.projectRepository.update(
        id,
        updateProjectDto,
      );
      if (affected <= 0) {
        throw new BadRequestException();
      }

      return {
        message: 'Successfully update the project',
      };
    } catch (error) {
      console.log(error);

      throw new BadGatewayException();
    }
  }

  async remove(id: number) {
    await this.projectRepository.delete(id);
    return {
      message: 'Succesfully remove the project!',
    };
  }
}
