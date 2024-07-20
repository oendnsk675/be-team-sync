import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: UserTeamRepository,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async getUserTeams(user_id: number) {
    return await this.repository.find({ where: { user_id } });
  }

  async saveMessage(payload: CreateMessageDto): Promise<Chat> {
    const message = this.chatRepository.create(payload);
    return await this.chatRepository.save(message);
  }

  async findAll(team_id: number, page: number, limit: number) {
    const data = await this.chatRepository.find({
      where: { team_id },
      relations: ['user', 'reply_to'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        chat_id: 'ASC',
      },
    });

    return {
      message: 'Successfull retrieve data user',
      data,
    };
  }
}
