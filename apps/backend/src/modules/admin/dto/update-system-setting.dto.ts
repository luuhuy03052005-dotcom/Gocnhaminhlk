import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSystemSettingDto {
  @IsObject()
  value: Record<string, unknown>;

  @IsOptional()
  @IsString()
  description?: string;
}
