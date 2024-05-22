import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  user_id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  fullname: string;

  @Expose()
  avatar?: string;

  @Expose()
  role: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
