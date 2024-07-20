import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      await this.projectRepository.save(createProjectDto);

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
        'project.projectId',
        'project.projectName',
        'project.description',
        'project.startDate',
        'project.endDate',
        'project.createdAt',
        'project.updatedAt',
        'team.teamId',
        'team.teamName',
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

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
