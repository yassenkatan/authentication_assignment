import { Type } from '@nestjs/common';
import { PageMetaDto } from '../dto/pagination-meta.dto';
import { PaginationModel } from '../models/pagination.model';

export function Paginated<T>(): Type<PaginationModel<T>> {
  abstract class PaginatedType extends PaginationModel<T> {
    readonly response: T[];
    readonly meta?: PageMetaDto;
  }
  return PaginatedType as Type<PaginationModel<T>>;
}
