import { ApiProperty } from '@nestjs/swagger';
import { FileResponseModel } from '../models/file.response';

export class FileResponseDto extends FileResponseModel {
  @ApiProperty()
  url: string;
  @ApiProperty()
  type: string;
}
