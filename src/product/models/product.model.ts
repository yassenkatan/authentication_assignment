import { UserProductModel } from './user-product.model';

export class ProductModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  userProduct?: UserProductModel[];
  createdAt: Date;
  updatedAt: Date;
}
