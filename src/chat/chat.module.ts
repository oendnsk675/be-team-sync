import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { UserTeam } from 'src/user_team/entities/user_team.entity';
import { UserRepository } from 'src/user/user.repository';
import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';

@Module({
  providers: [
    ChatService,
    ChatGateway,
    UserTeamRepository,
    JwtService,
    UserService,
    UserRepository,
  ],
  imports: [
    JwtModule.register({
      secret: 'team-sync',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, Team, UserTeam, Chat]),
  ],
  controllers: [ChatController],
})
export class ChatModule {}
