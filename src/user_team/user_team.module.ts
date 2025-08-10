import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/team/entities/team.entity';
import { TeamRepository } from 'src/team/team.repository';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserTeam } from './entities/user_team.entity';
import { UserTeamRepository } from './user_team.repository';
import { UserTeamService } from './user_team.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, UserTeam])],
  providers: [
    UserTeamService,
    UserTeamRepository,
    TeamRepository,
    UserRepository,
  ],
  exports: [UserTeamService, UserTeamRepository],
})
export class UserTeamModule {}
