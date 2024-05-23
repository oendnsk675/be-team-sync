import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateUserTeamDto } from 'src/user_team/dto/create-user_team.dto';
import { UserTeamService } from 'src/user_team/user_team.service';
import { RemoveUserTeamDto } from 'src/user_team/dto/remove-user_team.dto';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly userTeamService: UserTeamService,
  ) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Post('user/invite')
  invite(@Body() payload: CreateUserTeamDto) {
    return this.userTeamService.create(payload);
  }

  @Post('user/remove')
  removeUser(@Body() payload: RemoveUserTeamDto) {
    return this.userTeamService.remove(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }
}
