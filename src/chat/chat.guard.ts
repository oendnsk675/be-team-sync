import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import extract from 'src/common/utils/extract.token';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();

    const token = extract(client);

    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, 'team-sync') as any;

      return new Promise((resolve, reject) => {
        return this.userService.findOne(decoded.user_id).then((user) => {
          if (user) {
            client.data.user = user.data;
            resolve(true);
          } else {
            this.sendError(client, 'User not authenticated');
            reject(false);
          }
        });
      });
    } catch (ex) {
      // console.log(ex);
      this.sendError(client, 'Invalid or expired token');
      return false;
    }
  }
  private sendError(client: Socket, message: string): void {
    client.emit('error', { message });
    // client.disconnect();
  }
}
