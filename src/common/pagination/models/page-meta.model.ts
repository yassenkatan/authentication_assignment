import { isNumber } from 'class-validator';
import { IPageMetaParametersDto } from '../interfaces/pagination-meta-parameters.interface';

export class PageMetaModel {
  readonly page?: number;
  readonly limit?: number;
  readonly itemsCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaParametersDto) {
    this.page = pageOptionsDto?.page;
    this.limit = pageOptionsDto?.limit;
    this.itemsCount = itemCount;
    this.pageCount =
      isNumber(this.itemsCount) && isNumber(this.limit)
        ? Math.ceil(this.itemsCount / this.limit)
        : 0;
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
