import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignProductsToUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  productsIds: string[];
}
