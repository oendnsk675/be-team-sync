import { IsNotEmpty, IsInt } from 'class-validator';

export class DeleteProjectDto {
  @IsNotEmpty()
  @IsInt()
  projectId: number;
}
