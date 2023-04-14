import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { UpdateProductModel } from './models/update-product.model';
import { ProductModel } from './models/product.model';
import { CreateProductModel } from './models/create-product.model';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { PageOptionsModel } from 'src/common/pagination/models/page-options.model';
import { PageMetaModel } from 'src/common/pagination/models/page-meta.model';
import {
  ProductResponseForAdminModel,
  ProductResponseForClientModel,
} from './models/product-response.model';
import { UserService } from 'src/user/user.service';
import { UserModel } from 'src/user/models/user.model';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userService: UserService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async createNewProduct(
    createProductModel: CreateProductModel,
  ): Promise<ProductModel> {
    return await this.productRepository.createNewProduct(createProductModel);
  }

  async checkIfFindProductByIdAndGetIt(id: string): Promise<ProductModel> {
    const product: ProductModel = await this.productRepository.getProductById(
      id,
    );
    if (!product) {
      this.exceptionService.notFoundException({ message: 'Product not found' });
    }
    return product;
  }

  async getAllProducts(pageOptionsDto?: PageOptionsModel): Promise<{
    response: ProductModel[];
    meta: PageMetaModel;
  }> {
    return await this.productRepository.getAllProducts(pageOptionsDto);
  }

  async getUserProducts(userId: string, pageOptionsDto?: PageOptionsModel) {
    return await this.productRepository.getUserProducts(userId, pageOptionsDto);
  }

  async updateProduct(
    id: string,
    updateProductModel: UpdateProductModel,
  ): Promise<ProductModel> {
    const product: ProductModel = await this.checkIfFindProductByIdAndGetIt(id);
    return await this.productRepository.updateProduct(
      product?.id,
      updateProductModel,
    );
  }

  async assignUsersToProduct(
    userId: string,
    productsIds: string[],
  ): Promise<UserModel> {
    let user: UserModel = await this.userService.checkIfUserFindByIdAndGetIt(
      userId,
    );
    user = await this.userService.unAssignUserToProducts(userId);
    user = await this.userService.assignUserToProducts(user?.id, productsIds);
    return user;
  }

  async deleteProduct(id: string): Promise<string> {
    const product: ProductModel = await this.checkIfFindProductByIdAndGetIt(id);
    if (product?.userProduct && product?.userProduct?.length !== 0) {
      this.exceptionService.badRequestException({
        message: 'Product has users',
      });
    }
    return await this.productRepository.deleteProduct(product);
  }

  async makeProductResponseForClient(
    product: ProductModel,
  ): Promise<ProductResponseForClientModel> {
    return new ProductResponseForClientModel(product);
  }

  async makeProductResponseForAdmin(
    product: ProductModel,
  ): Promise<ProductResponseForAdminModel> {
    return new ProductResponseForAdminModel(product);
  }

  async makeAllProductsResponseForClient(
    products: ProductModel[],
  ): Promise<ProductResponseForClientModel[]> {
    const productsResponse: ProductResponseForClientModel[] = [];
    for (let i = 0; i < products?.length; i++) {
      const product: ProductModel = products[i];
      const P = await this.makeProductResponseForClient(product);
      productsResponse.push(P);
    }
    return productsResponse;
  }

  async makeAllProductsResponseForAdmin(
    products: ProductModel[],
  ): Promise<ProductResponseForAdminModel[]> {
    const productsResponse: ProductResponseForAdminModel[] = [];
    for (let i = 0; i < products?.length; i++) {
      const product: ProductModel = products[i];
      const P = await this.makeProductResponseForAdmin(product);
      productsResponse.push(P);
    }
    return productsResponse;
  }
}
