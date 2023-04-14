import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
