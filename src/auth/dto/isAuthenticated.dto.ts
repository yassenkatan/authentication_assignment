import { ApiProperty } from '@nestjs/swagger';
import { IsAuthenticatedResponseModel } from '../models/isAuthenticated-response.model';

export class IsAuthenticatedDto extends IsAuthenticatedResponseModel {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;
}
