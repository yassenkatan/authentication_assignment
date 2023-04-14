import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { AdminProductController } from './admin-product.controller';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminProductController],
  providers: [ProductService, UserRepository, UserService, ProductRepository],
})
export class AdminProductModule {}
