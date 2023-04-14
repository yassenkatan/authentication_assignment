import { UserProductModel } from 'src/product/models/user-product.model';
import { UserRole } from './user-role.enum';

export class UserModel {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  password: string;
  userRole: UserRole;
  isVerified: boolean;
  hashRefreshToken?: string;
  otpCode: number;
  otpCodeExpireDate?: bigint;
  lastLogin?: Date;
  userProduct?: UserProductModel[];
  createdAt?: Date;
  updatedAt?: Date;
}
