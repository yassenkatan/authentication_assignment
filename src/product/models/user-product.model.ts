import { UserModel } from 'src/user/models/user.model';
import { ProductModel } from './product.model';

export class UserProductModel {
  id: string;
  user?: UserModel;
  userId?: string;
  product?: ProductModel;
  productId?: string;
}
