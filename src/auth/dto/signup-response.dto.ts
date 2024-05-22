import { IsString } from 'class-validator';
import { ResponseSignupDto } from './signup.dto';

export class SignupResponseDto {
  @IsString()
  message: string;

  data: ResponseSignupDto;
}
