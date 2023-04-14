import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpirationDate: Date;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpirationDate: Date;
}

export class UserNotVerified {
  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  email: string;
}
