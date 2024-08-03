import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { TeamRepository } from 'src/team/team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Team])],
  controllers: [ProjectController],
  providers: [ProjectService, TeamRepository],
})
export class ProjectModule {}
