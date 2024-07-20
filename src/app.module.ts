import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { UserTeamModule } from './user_team/user_team.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    UserModule,
    TeamModule,
    UserTeamModule,
    TaskModule,
    ProjectModule,
    ChatModule,
  ],
})
export class AppModule {}
