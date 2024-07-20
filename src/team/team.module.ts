import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController, TeamsController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamRepository } from './team.repository';
import { UserTeamModule } from 'src/user_team/user_team.module';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { UserTeam } from 'src/user_team/entities/user_team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, UserTeam]), UserTeamModule],
  controllers: [TeamController, TeamsController],
  providers: [TeamService, TeamRepository, UserTeamRepository],
})
export class TeamModule {}
