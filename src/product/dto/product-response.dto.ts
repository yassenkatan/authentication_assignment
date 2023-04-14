import {
  ProductResponseForAdminModel,
  ProductResponseForClientModel,
} from '../models/product-response.model';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseForAdminDto extends ProductResponseForAdminModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class ProductResponseForClientDto extends ProductResponseForClientModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
