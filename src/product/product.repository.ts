import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { CreateProductModel } from './models/create-product.model';
import { PageOptionsModel } from 'src/common/pagination/models/page-options.model';
import { UpdateProductModel } from './models/update-product.model';
import { ProductModel } from './models/product.model';
import { PageMetaDto } from 'src/common/pagination/dto/pagination-meta.dto';
import { PageMetaModel } from 'src/common/pagination/models/page-meta.model';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createNewProduct(
    createProductModel: CreateProductModel,
  ): Promise<ProductModel> {
    return await this.prismaService.product.create({
      data: {
        name: createProductModel?.name,
        description: createProductModel?.description,
        imageUrl: createProductModel?.imageUrl,
        price: createProductModel?.price,
      },
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getProductById(id: string): Promise<ProductModel> {
    return await this.prismaService.product.findFirst({
      where: {
        id: id,
      },
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getAllProducts(pageOptionsDto?: PageOptionsModel): Promise<{
    response: ProductModel[];
    meta: PageMetaModel;
  }> {
    const products = await this.prismaService.product.findMany({
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
      skip: pageOptionsDto?.skip,
      take: pageOptionsDto?.limit,
      orderBy: {
        createdAt: pageOptionsDto?.order,
      },
    });

    const itemCount = await this.prismaService.product.count({});

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount,
    });

    return {
      response: products,
      meta: pageMetaDto,
    };
  }

  async getUserProducts(
    userId: string,
    pageOptionsDto?: PageOptionsModel,
  ): Promise<{
    response: ProductModel[];
    meta: PageMetaModel;
  }> {
    const products = await this.prismaService.product.findMany({
      where: {
        userProduct: {
          every: {
            userId: userId,
          },
        },
      },
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
      skip: pageOptionsDto?.skip,
      take: pageOptionsDto?.limit,
      orderBy: {
        createdAt: pageOptionsDto?.order,
      },
    });

    const itemCount = await this.prismaService.product.count({
      where: {
        userProduct: {
          every: {
            userId: userId,
          },
        },
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount,
    });

    return {
      response: products,
      meta: pageMetaDto,
    };
  }

  async updateProduct(
    id: string,
    updateProductModel: UpdateProductModel,
  ): Promise<ProductModel> {
    return await this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        name: updateProductModel?.name,
        description: updateProductModel?.description,
        imageUrl: updateProductModel?.imageUrl,
        price: updateProductModel?.price,
      },
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async assignUsersToProduct(
    product: ProductModel,
    usersIds: string[],
  ): Promise<ProductModel> {
    let assignedProduct: ProductModel;
    for (let i = 0; i < usersIds?.length; i++) {
      const userId = usersIds[i];
      const userProduct = product?.userProduct.find(
        (product) => product?.user?.id === userId,
      );
      if (!userProduct) {
        assignedProduct = await this.prismaService.product.update({
          where: {
            id: product?.id,
          },
          data: {
            userProduct: {
              create: {
                userId: userId,
              },
            },
          },
          include: {
            userProduct: {
              include: {
                user: true,
              },
            },
          },
        });
      }
    }
    return assignedProduct;
  }

  async unAssignProduct(product: ProductModel): Promise<ProductModel> {
    return await this.prismaService.product.update({
      where: {
        id: product?.id,
      },
      data: {
        userProduct: {
          deleteMany: {
            productId: product?.id,
          },
        },
      },
      include: {
        userProduct: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async deleteProduct(product: ProductModel): Promise<string> {
    await this.prismaService.product.delete({
      where: {
        id: product?.id,
      },
    });
    return `Product deleted`;
  }
}
