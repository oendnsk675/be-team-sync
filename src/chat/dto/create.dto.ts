import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsNotEmpty()
  @IsString()
  iv: string;

  @IsOptional()
  @IsNumber()
  reply_to?: Chat;
}
