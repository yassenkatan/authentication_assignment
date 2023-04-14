import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UpdateUserModel } from '../models/update-user.model';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends UpdateUserModel {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  email: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  phoneNumber: string;
}
