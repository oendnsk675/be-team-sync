import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController, TeamsController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamRepository } from './team.repository';
import { UserTeamModule } from 'src/user_team/user_team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), UserTeamModule],
  controllers: [TeamController, TeamsController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
