import { IsNumber, IsString } from 'class-validator';

export class SignInResponseDto {
  @IsNumber()
  statusCode: number;

  @IsString()
  message: string;

  data: {
    access_token: string;
    refresh_token: string;
  };
}
