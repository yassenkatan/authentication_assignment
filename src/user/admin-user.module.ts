import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AdminUserController } from './admin-user.controller';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { UserService } from './user.service';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController],
  providers: [UserRepository, UserService, ExceptionsService],
  exports: [UserRepository, UserService],
})
export class AdminUserModule {}
