import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createAuthDto: CreateUserDto) {
    return await this.userService.create(createAuthDto);
  }

  @Get('profile')
  async findProfile(@Request() req) {
    return await this.userService.findOne(req.user.user_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return await this.userService.update(+id, updateAuthDto);
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  findAll(@Query('query') query: string) {
    return this.userService.findAll(query);
  }

  @Get(':team_id')
  findAllUserForInvite(
    @Query('query') query: string,
    @Param('team_id') team_id: string,
  ) {
    return this.userService.findAllUserForInvite(+team_id, query);
  }
}
