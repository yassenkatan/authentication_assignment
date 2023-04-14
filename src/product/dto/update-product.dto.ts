import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateProductModel } from '../models/update-product.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends UpdateProductModel {
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
