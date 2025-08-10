import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserTeam } from 'src/user_team/entities/user_team.entity';
import { UserTeamModule } from 'src/user_team/user_team.module';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { Team } from './entities/team.entity';
import { TeamController, TeamsController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, UserTeam, Task, User]),
    UserTeamModule,
  ],
  controllers: [TeamController, TeamsController],
  providers: [TeamService, TeamRepository, UserTeamRepository, UserRepository],
})
export class TeamModule {}
