import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientProductController } from './client-product.controller';
import { ProductRepository } from './product.repository';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ClientProductController],
  providers: [ProductService, UserRepository, UserService, ProductRepository],
})
export class ClientProductModule {}
