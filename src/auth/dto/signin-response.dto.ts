import { IsString } from 'class-validator';

export class SignInResponseDto {
  @IsString()
  message: string;

  data: {
    access_token: string;
    refresh_token: string;
  };
}
