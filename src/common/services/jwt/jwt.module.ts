import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { getJwtModuleOptions } from './jwt.config';
import { JwtTokenService } from './jwt.service';

@Module({
  imports: [
    Jwt.registerAsync({
      inject: [EnvironmentConfigService],
      useFactory: getJwtModuleOptions,
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtModule {}
