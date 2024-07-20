import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: () => void) {
    const { email, username } = req.body;
    if (email) {
      const user = await this.userService.findByEmail(email); // Ganti dengan metode yang sesuai
      if (user) {
        throw new BadRequestException('Email already exists');
      }
    }
    if (username) {
      const user = await this.userService.findByUsername(username); // Ganti dengan metode yang sesuai
      if (user) {
        throw new BadRequestException('Username already exists');
      }
    }
    next();
  }
}
