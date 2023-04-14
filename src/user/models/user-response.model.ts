import {
  ProductResponseForAdminModel,
  ProductResponseForClientModel,
} from 'src/product/models/product-response.model';
import { UserRole } from './user-role.enum';
import { UserModel } from './user.model';
import { UserProductModel } from 'src/product/models/user-product.model';

export class UserResponseForAdminModel {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  userRole: UserRole;
  isVerified: boolean;
  lastLogin?: Date;
  products: ProductResponseForAdminModel[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(userModel: UserModel) {
    this.id = userModel?.id;
    this.fullName = `${userModel?.firstName} ${userModel?.lastName}`;
    this.firstName = userModel?.firstName;
    this.lastName = userModel?.lastName;
    this.email = userModel?.email;
    this.phoneNumber = userModel?.phoneNumber;
    this.userRole = userModel?.userRole;
    this.isVerified = userModel?.isVerified;
    this.lastLogin = userModel?.lastLogin;
    this.products = userModel?.userProduct?.map(
      (userProduct: UserProductModel) => {
        return new ProductResponseForAdminModel(userProduct?.product);
      },
    );
    this.createdAt = userModel?.createdAt;
    this.updatedAt = userModel?.updatedAt;
  }
}

export class UserResponseForClientModel {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  products: ProductResponseForClientModel[];

  constructor(userModel: UserModel) {
    this.id = userModel?.id;
    this.fullName = `${userModel?.firstName} ${userModel?.lastName}`;
    this.firstName = userModel?.firstName;
    this.lastName = userModel?.lastName;
    this.email = userModel?.email;
    this.phoneNumber = userModel?.phoneNumber;
    this.products = userModel?.userProduct?.map(
      (userProduct: UserProductModel) => {
        return new ProductResponseForClientModel(userProduct?.product);
      },
    );
  }
}
