import { IsString } from 'class-validator';

export class SetPublicKeyDto {
  @IsString()
  public_key: string;
}
