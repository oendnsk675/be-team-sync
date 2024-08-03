import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController, TasksController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project])],
  controllers: [TaskController, TasksController],
  providers: [TaskService],
})
export class TaskModule {}
