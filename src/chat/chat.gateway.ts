import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  MiddlewareConsumer,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ChatMiddleware } from './chat.middleware';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ChatGuard } from './chat.guard';
import { CreateMessageDto } from './dto/create.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ChatMiddleware).forRoutes(ChatGateway);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.token;
      const actualToken = Array.isArray(token) ? token[0] : token;

      if (!actualToken) {
        throw new UnauthorizedException('Token not provided');
      }

      const jwtPayload = this.jwtService.verify(actualToken, {
        publicKey: 'team-sync',
      });
      const user = await this.userService.findOne(jwtPayload.user_id);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      client.data.user = user;

      const teams = await this.chatService.getUserTeams(user.data.user_id);

      teams.forEach((team) => {
        client.join(`team_${team.team_id}`);
        console.log(`Client ${client.id} joined room team_${team.team_id}`);
      });
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ) {
    // // Save message to the database
    await this.chatService.saveMessage(payload);

    // // Emit message to the specific team room
    this.server.to(`team_${payload.teamId}`).emit('message', payload);
  }
}
