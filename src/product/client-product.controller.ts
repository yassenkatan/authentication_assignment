import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ProductResponseForClientDto } from './dto/product-response.dto';
import { PageOptionsDto } from 'src/common/pagination/dto/pagination-options.dto';
import { ProductResponseForClientModel } from './models/product-response.model';
import { PageMetaDto } from 'src/common/pagination/dto/pagination-meta.dto';
import { User } from 'src/common/decorators/user.decorator';
import { PageDto } from 'src/common/pagination/dto/pagination.dto';
import { UserRole } from 'src/user/models/user-role.enum';

@ApiTags('Product')
@Auth(UserRole.User)
@Controller('client/product')
export class ClientProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('my-products')
  @ApiOperation({
    summary: 'Get my products',
    description: 'Get my products',
  })
  @ApiOkResponse({ type: [ProductResponseForClientDto] })
  async getMyProducts(
    @User('id') userId: string,
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: ProductResponseForClientModel[];
    meta: PageMetaDto;
  }> {
    const products = await this.productService.getUserProducts(
      userId,
      pageOptionsDto,
    );

    const response = await this.productService.makeAllProductsResponseForClient(
      products?.response,
    );
    const pagination = new PageDto(response, products?.meta);
    return {
      response: pagination?.response,
      meta: pagination?.meta,
    };
  }
}
