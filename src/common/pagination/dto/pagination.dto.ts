import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './pagination-meta.dto';
import { PaginationModel } from '../models/pagination.model';

export class PageDto<T> extends PaginationModel<T> {
  @ApiProperty({ type: Array<T> })
  readonly response: T[];
  @ApiProperty({ type: () => PageMetaDto })
  readonly meta?: PageMetaDto;
}
