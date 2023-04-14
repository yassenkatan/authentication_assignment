import { JwtModuleOptions } from '@nestjs/jwt';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';

export const getJwtModuleOptions = (
  config: EnvironmentConfigService,
): JwtModuleOptions => {
  return {
    secret: config.getJwtSecret(),
    signOptions: { expiresIn: config.getJwtExpirationTime() },
  };
};
