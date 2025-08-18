import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateJobDto {
  @IsString()
  job_title: string;

  @IsOptional()
  @IsString()
  seniority_level?: string;

  @IsOptional()
  @IsString()
  employment_type?: string;

  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsString()
  schedule_hours_local?: string;

  @IsOptional()
  @IsString()
  work_days?: string;

  @IsOptional()
  @IsString()
  days_off?: string;

  @IsOptional()
  @IsString()
  compensation_currency?: string;

  @IsOptional()
  @IsNumber()
  compensation_min?: number;

  @IsOptional()
  @IsNumber()
  compensation_max?: number;

  @IsOptional()
  @IsString()
  compensation_notes?: string;

  @IsOptional()
  @IsString()
  role_overview?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsArray()
  requirements?: string[];

  @IsOptional()
  @IsString()
  benefits?: string;
}
