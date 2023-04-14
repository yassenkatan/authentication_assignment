import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { SignupUserModel } from '../models/signup-user.model';

export class SignupUserByPhoneNumberDto extends SignupUserModel {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly lastName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    {
      message: 'Phone number not valid',
    },
  )
  readonly phoneNumber: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, {
    message:
      'password must contain letters (upper and lower case) and numbers and special character',
  })
  readonly password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Match('password')
  readonly confirmPassword: string;
}

export class SignupUserByEmailDto extends SignupUserModel {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly lastName: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(20)
  @Matches(
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    {
      message: 'Phone number not valid',
    },
  )
  readonly phoneNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, {
    message:
      'password must contain letters (upper and lower case) and numbers and special character',
  })
  readonly password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Match('password')
  readonly confirmPassword: string;
}
