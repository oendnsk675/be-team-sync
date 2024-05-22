import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
