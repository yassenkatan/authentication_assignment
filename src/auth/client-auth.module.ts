import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { PrismaModule } from 'src/common/services/prisma/prisma.module';
import { ClientAuthController } from './client-auth.controller';
import { JwtTokenService } from 'src/common/services/jwt/jwt.service';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';
import { EventService } from 'src/common/event/event.service';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [ClientAuthController],
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
export class ClientAuthModule {}
