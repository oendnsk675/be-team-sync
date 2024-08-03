import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { CustomBadGatewayExceptionFilter } from 'src/common/filters/bad-gateway-exception.filter';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const { assignees, ...taskData } = createTaskDto;

      // Find users to assign
      let assignedUsers: User[] = [];
      if (assignees && assignees.length > 0) {
        assignedUsers = await this.userRepository.findBy({
          user_id: In(assignees),
        });
      }

      if (!assignedUsers || assignedUsers.length <= 0) {
        throw new BadRequestException('User Not Found!');
      }

      // Create and save the task
      const task = this.taskRepository.create({
        ...taskData,
        assignees: assignedUsers,
      });

      return this.taskRepository.save(task);
    } catch (error) {
      if (error.response.error == 'Bad Request') {
        throw new BadRequestException(error.response.message);
      }
      throw new BadGatewayException();
    }
  }

  async findAll() {
    try {
      const data = await this.taskRepository.find();
      return {
        message: 'Successfully retrieve all task.',
        data,
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async countTaskByAssign(userId: number) {
    try {
      const totalTask = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoin('task.assignees', 'user')
        .where('user.user_id = :userId', { userId })
        .getCount();

      const totalTaskCompleted = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoin('task.assignees', 'user')
        .where('user.user_id = :userId', { userId })
        .where('task.status = :status', { status: true })
        .getCount();

      const totalTaskUnCompleted = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoin('task.assignees', 'user')
        .where('user.user_id = :userId', { userId })
        .where('task.status = :status', { status: false })
        .getCount();

      return {
        message: 'Successfully retrieve total task.',
        data: {
          totalTask,
          totalTaskCompleted,
          totalTaskUnCompleted,
        },
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
