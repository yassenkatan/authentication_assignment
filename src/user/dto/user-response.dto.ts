import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user-role.enum';
import {
  UserResponseForAdminModel,
  UserResponseForClientModel,
} from '../models/user-response.model';
import {
  ProductResponseForAdminModel,
  ProductResponseForClientModel,
} from 'src/product/models/product-response.model';
import {
  ProductResponseForAdminDto,
  ProductResponseForClientDto,
} from 'src/product/dto/product-response.dto';

export class UserResponseForAdminDto extends UserResponseForAdminModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName?: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty({ enumName: 'UserRole', enum: UserRole })
  userRole: UserRole;
  @ApiProperty()
  isVerified: boolean;
  @ApiProperty()
  lastLogin?: Date;
  @ApiProperty({ type: [ProductResponseForAdminDto] })
  products: ProductResponseForAdminModel[];
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
}

export class UserResponseForClientDto extends UserResponseForClientModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName?: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty({ type: [ProductResponseForClientDto] })
  products: ProductResponseForClientModel[];
}
