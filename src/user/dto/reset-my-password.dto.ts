import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ResetMyPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

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
  @MinLength(8)
  @Match('newPassword')
  confirmNewPassword: string;
}
