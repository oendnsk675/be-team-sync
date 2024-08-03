import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthMiddleware } from './auth.middleware';
import { UserService } from 'src/user/user.service';
import { UserTeam } from 'src/user_team/entities/user_team.entity';
import { UserTeamRepository } from 'src/user_team/user_team.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development.local' }),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED },
    }),
    TypeOrmModule.forFeature([User, UserTeam]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, UserTeamRepository],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/sign-up', method: RequestMethod.POST });
  }
}
