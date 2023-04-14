import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserRepository } from 'src/user/user.repository';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, SeederService, BcryptService],
})
export class SeederModule {}
