import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  otpCode: number;
}

export class ResendConfirmOTPDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  email: string;
}
