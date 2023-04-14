import { ApiProperty } from '@nestjs/swagger';
import { CreateProductModel } from '../models/create-product.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto extends CreateProductModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
