import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Chat } from '../entities/chat.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  team_id: number;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  reply_to?: Chat;
}
