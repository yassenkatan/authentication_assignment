import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { LoginUserModel } from '../models/login-user.model';

export class LoginUserDto extends LoginUserModel {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
