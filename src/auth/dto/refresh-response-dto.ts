import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  accessTokenExpirationDate: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  refreshTokenExpirationDate: string;
}
