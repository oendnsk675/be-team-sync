import {
  MiddlewareConsumer,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import extract from 'src/common/utils/extract.token';
import { UserService } from 'src/user/user.service';
import { ChatGuard } from './chat.guard';
import { ChatMiddleware } from './chat.middleware';
import { ChatService } from './chat.service';
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
      const token = extract(client);

      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const jwtPayload = this.jwtService.verify(token, {
        publicKey: 'team-sync',
      });
      const user = await this.userService.findOne(jwtPayload.user_id);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      client.data.user = user;

      const teams = await this.chatService.getUserTeams(user.data.user_id);
      console.log({ teams, user_id: user.data.user_id });

      teams.forEach((team) => {
        client.join(`team_${team.team_id}`);
        console.log(`Client ${client.id} joined room team_${team.team_id}`);
      });

      const socketsInRoom = await this.server.in('team_1').fetchSockets();

      console.log(socketsInRoom.map((s) => s.id));

      await this.userService.updateStatus(user.data.user_id, true);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const token = extract(client);
    const jwtPayload = this.jwtService.verify(token, {
      publicKey: 'team-sync',
    });
    console.log(
      `Client disconnected: ${jwtPayload.user_id} with client id: ${client.id}`,
    );

    await this.userService.updateStatus(jwtPayload.user_id, false);
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ) {
    const data = {
      user_id: client.data.user.user_id,
      ...payload,
    };
    const room = `team_${payload.team_id}`;
    const user = await this.userService
      .findOne(client.data.user.user_id)
      .then((user) => {
        return {
          avatar: user.data.avatar,
          fullname: user.data.fullname,
        };
      });

    if (!user) {
      throw new UnauthorizedException('User source message not found');
    }

    // // Save message to the database
    const message = await this.chatService.saveMessage(data);

    // // Emit message to the specific team room
    this.server
      .to(room)
      .emit('message', { user, createdAt: message.createdAt, ...data });
  }
}
