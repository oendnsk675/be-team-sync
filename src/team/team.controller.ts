import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserTeamDto } from 'src/user_team/dto/create-user_team.dto';
import { RemoveUserTeamDto } from 'src/user_team/dto/remove-user_team.dto';
import { UserTeamService } from 'src/user_team/user_team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly userTeamService: UserTeamService,
  ) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamService.create(createTeamDto, req.user.user_id);
  }

  @Post('member/invite')
  invite(@Body() payload: CreateUserTeamDto) {
    return this.userTeamService.create(payload);
  }

  @Post('member/suspend')
  removeUser(@Body() payload: RemoveUserTeamDto) {
    return this.userTeamService.remove(payload);
  }

  @Get('count')
  getTotalTeam(@Request() req) {
    return this.teamService.getTotalTeam(req.user.user_id);
  }

  @Get('members/:team_id')
  getTeamMembers(
    @Param('team_id') team_id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.teamService.findAllMember(team_id, page, limit);
  }

  @Get(':teamId/member/count')
  getTotalMember(@Request() req, @Param('teamId') teamId: string) {
    return this.teamService.getTotalMember(req.user.user_id, +teamId);
  }

  @Get('user/active')
  getTotalUserActive(@Query('team_id') team_id: string) {
    return this.teamService.getTotalUserActive(+team_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch('image/:team_id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/teams/images',
        filename: (req, file, cb) => {
          // Menggunakan ID pengguna sebagai nama file untuk memastikan tidak ada duplikat
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${req.user.user_id}-${uniqueSuffix}${ext}`;

          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  updateImageTeam(@Param() team_id: string, @UploadedFile() file: any) {
    return this.teamService.updateImageTeam(+team_id, file.filename);
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
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.teamService.findAll(page, limit);
  }
}
