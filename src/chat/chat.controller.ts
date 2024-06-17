import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':team_id')
  async findAll(
    @Param('team_id', ParseIntPipe) team_id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.chatService.findAll(team_id, page, limit);
  }
}
