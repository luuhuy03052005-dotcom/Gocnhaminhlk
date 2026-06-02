import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
