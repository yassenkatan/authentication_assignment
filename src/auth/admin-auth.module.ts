import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { EventService } from 'src/common/event/event.service';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';
import { JwtTokenService } from 'src/common/services/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [AdminAuthController],
  providers: [
    UserRepository,
    UserService,
    AuthService,
    BcryptService,
    ExceptionsService,
    EventService,
    EnvironmentConfigService,
    JwtTokenService,
    JwtService,
  ],
  exports: [AuthService],
})
export class AdminAuthModule {}
