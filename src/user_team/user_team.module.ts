import { Module } from '@nestjs/common';
import { UserTeamService } from './user_team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { UserTeam } from './entities/user_team.entity';
import { UserTeamRepository } from './user_team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, UserTeam])],
  providers: [UserTeamService, UserTeamRepository],
  exports: [UserTeamService, UserTeamRepository],
})
export class UserTeamModule {}
