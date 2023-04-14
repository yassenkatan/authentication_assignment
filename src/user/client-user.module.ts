import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { UserService } from './user.service';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { ClientUserController } from './client-user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClientUserController],
  providers: [UserRepository, UserService, ExceptionsService],
  exports: [UserRepository, UserService],
})
export class ClientUserModule {}
