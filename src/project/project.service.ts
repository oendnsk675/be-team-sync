import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRepository } from 'src/team/team.repository';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly teamRepository: TeamRepository,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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

  async findTask(project_id: number) {
    const data = await this.taskRepository.find({
      where: { projectId: project_id },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Successfully retrieved data task project',
      data,
    };
  }

  async findAll(
    team_id: number,
    status: string = 'open',
    page: number = 1,
    limit: number = 10,
  ) {
    const offset = (page - 1) * limit;

    // ambil jumlah data yg open dan close
    const openCount = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'open' })
      .getCount();

    const closeCount = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'close' })
      .getCount();

    const [projects, total] = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.team', 'team')
      .leftJoin('team.userTeams', 'userTeam')
      .where('userTeam.team_id = :team_id', { team_id })
      .where('project.status = :status', { status })
      .select([
        'project.project_id',
        'project.project_name',
        'project.visibility',
        'project.status',
        'project.createdAt',
        'project.updatedAt',
      ])
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Successfully retrieved data projects',
      data: {
        data: projects,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        openCount,
        closeCount,
      },
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
