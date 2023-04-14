import { ProductModel } from './product.model';

export class ProductResponseForAdminModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(productModel: ProductModel) {
    this.id = productModel?.id;
    this.name = productModel?.name;
    this.description = productModel?.description;
    this.imageUrl = productModel?.imageUrl;
    this.price = productModel?.price;
    this.createdAt = productModel?.createdAt;
    this.updatedAt = productModel?.updatedAt;
  }
}

export class ProductResponseForClientModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(productModel: ProductModel) {
    this.id = productModel?.id;
    this.name = productModel?.name;
    this.description = productModel?.description;
    this.imageUrl = productModel?.imageUrl;
    this.price = productModel?.price;
    this.createdAt = productModel?.createdAt;
    this.updatedAt = productModel?.updatedAt;
  }
}
