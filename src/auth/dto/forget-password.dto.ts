import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class SendOtpCodeDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  otpCode: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W)/, {
    message:
      'password must contain letters (upper and lower case) and numbers and special character',
  })
  newPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Match('newPassword')
  confirmNewPassword: string;
}
