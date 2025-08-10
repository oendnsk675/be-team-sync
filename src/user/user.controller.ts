import {
  BadRequestException,
  Body,
  Controller,
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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPublicKeyDto } from './dto/set-public-key.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

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

  @Post('me/public-key')
  @UseGuards(JwtAuthGuard)
  async setPublicKey(@CurrentUser() user: User, @Body() dto: SetPublicKeyDto) {
    return this.userService.setPublicKey(user.user_id, dto.public_key);
  }

  @Get('me/public-key')
  @UseGuards(JwtAuthGuard)
  async getPublicKey(@CurrentUser() user: User) {
    return this.userService.getPublicKey(user.user_id);
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
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
  async updateAvtar(@UploadedFile() file: any, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.userService.updateAvatar(req.user.user_id, file.filename);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch()
  async update(@Request() req: any, @Body() updateAuthDto: UpdateUserDto) {
    return await this.userService.update(+req.user.user_id, updateAuthDto);
  }
}

@UseGuards(JwtAuthGuard)
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
    @Request() req,
  ) {
    return this.userService.findAllUserForInvite(
      +team_id,
      req.user.user_id,
      query,
    );
  }
}
