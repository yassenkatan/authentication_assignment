import { Order } from './order.enum';

export abstract class PageOptionsModel {
  abstract order?: Order;
  abstract page?: number;
  abstract limit?: number;
  abstract skip?: number;
}
