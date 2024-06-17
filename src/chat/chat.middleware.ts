import { Injectable, NestMiddleware } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from './user/user.service';

@Injectable()
export class ChatMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly userService: UserService,
  ) {}

  async use(socket: Socket & { user: null }, next: () => void) {
    try {
      console.log('middleware');

      const jwtPayload = this.jwtService.verify(
        socket.handshake.auth.jwt ?? '',
      );
      // const userResult = await this.userService.getUser(jwtPayload.userID);
      // if (userResult.isSuccess) {
      //   socket.user = userResult.data;
      //   next();
      // } else {
      //   throw new Error('Unauthorized');
      // }
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }
}
