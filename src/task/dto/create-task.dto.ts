import {
  IsInt,
  IsDate,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  projectId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  assignees?: number[];

  @IsInt()
  title: string;

  @IsInt()
  description: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsDate()
  @IsOptional()
  startAt: Date;

  @IsDate()
  @IsOptional()
  endAt: Date;
}
