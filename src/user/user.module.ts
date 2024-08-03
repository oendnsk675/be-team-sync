import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { Task } from 'src/task/entities/task.entity';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { UserTeam } from 'src/user_team/entities/user_team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, UserTeam])],
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepository, UserTeamRepository],
  exports: [UserRepository],
})
export class UserModule {}
