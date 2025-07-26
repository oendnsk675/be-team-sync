import {
  IsInt,
  IsDate,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  projectId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  assignees?: number[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  column: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsDate()
  @IsOptional()
  startAt?: Date;

  @IsDate()
  @IsOptional()
  endAt?: Date;
}
