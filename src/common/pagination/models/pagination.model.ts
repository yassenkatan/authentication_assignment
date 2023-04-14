import { PageMetaModel } from './page-meta.model';

export class PaginationModel<T> {
  readonly response: T[];

  readonly meta?: PageMetaModel;

  constructor(response?: T[], meta?: PageMetaModel) {
    this.response = response ?? [];
    this.meta = meta;
  }
}
