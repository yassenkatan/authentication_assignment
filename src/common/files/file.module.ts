import { Module } from '@nestjs/common';
import { PrismaModule } from '../services/prisma/prisma.module';
import { FileController } from './controllers/file.controller';
import { FileService } from './file.service';

@Module({
  imports: [PrismaModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
