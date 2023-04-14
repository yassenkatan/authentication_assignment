import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductResponseForAdminDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PageOptionsDto } from 'src/common/pagination/dto/pagination-options.dto';
import { PageDto } from 'src/common/pagination/dto/pagination.dto';
import { AssignProductsToUserDto } from './dto/assign-users-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseForAdminModel } from './models/product-response.model';
import { PageMetaDto } from 'src/common/pagination/dto/pagination-meta.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { UserService } from 'src/user/user.service';
import { UserResponseForAdminDto } from 'src/user/dto/user-response.dto';

@ApiTags('Product')
@Auth(UserRole.Admin)
@Controller('dashboard/product')
export class AdminProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new product',
    description: 'Create new product',
  })
  @ApiOkResponse({ type: ProductResponseForAdminDto })
  async createNewProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseForAdminModel> {
    const product = await this.productService.createNewProduct(
      createProductDto,
    );
    return await this.productService.makeProductResponseForAdmin(product);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products',
  })
  @ApiOkResponse({ type: [ProductResponseForAdminDto] })
  async getAllProducts(
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: ProductResponseForAdminModel[];
    meta: PageMetaDto;
  }> {
    const products = await this.productService.getAllProducts(pageOptionsDto);

    const response = await this.productService.makeAllProductsResponseForAdmin(
      products?.response,
    );
    const pagination = new PageDto(response, products?.meta);
    return {
      response: pagination?.response,
      meta: pagination?.meta,
    };
  }

  @Get('user-products/:userId')
  @ApiOperation({
    summary: 'Get user products',
    description: 'Get user products',
  })
  @ApiOkResponse({ type: [ProductResponseForAdminDto] })
  async getUserProducts(
    @Param('userId') userId: string,
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: ProductResponseForAdminModel[];
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

  @Get('/:id')
  @ApiOperation({
    summary: 'Get product by Id',
    description: 'Get product by Id',
  })
  @ApiOkResponse({ type: ProductResponseForAdminDto })
  async getProductById(
    @Param('id') id: string,
  ): Promise<ProductResponseForAdminModel> {
    const role = await this.productService.checkIfFindProductByIdAndGetIt(id);
    return await this.productService.makeProductResponseForAdmin(role);
  }

  @Put('assign-products')
  @ApiOperation({
    summary: 'Assign products to user',
    description: 'Assign products to user',
  })
  @ApiOkResponse({ type: UserResponseForAdminDto })
  async assignProductsToUser(
    @Body() assignProductsToUserDto: AssignProductsToUserDto,
  ): Promise<UserResponseForAdminDto> {
    const user = await this.productService.assignUsersToProduct(
      assignProductsToUserDto?.userId,
      assignProductsToUserDto?.productsIds,
    );
    return await this.userService.makeUserResponseForAdmin(user);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update product',
  })
  @ApiOkResponse({ type: ProductResponseForAdminDto })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseForAdminModel> {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
    );
    return await this.productService.makeProductResponseForAdmin(product);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete product',
  })
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }
}
