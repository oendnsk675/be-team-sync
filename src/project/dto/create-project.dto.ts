import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { StatusProject, Visibility } from 'src/common/enums/projects';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  @IsOptional()
  @IsEnum(Visibility)
  visibility: Visibility;

  @IsOptional()
  @IsEnum(StatusProject)
  status: StatusProject;
}
