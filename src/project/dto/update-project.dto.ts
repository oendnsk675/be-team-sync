import { IsString, IsOptional, IsEnum } from 'class-validator';
import { StatusProject, Visibility } from 'src/common/enums/projects';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  teamId: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility: Visibility;

  @IsOptional()
  @IsEnum(StatusProject)
  status: StatusProject;
}
