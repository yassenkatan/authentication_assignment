import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  // base
  @IsString()
  SERVER_PROTOCOL: string;
  @IsNumber()
  SERVER_PORT: number;
  @IsString()
  SERVER_HOSTNAME: string;
  @IsNumber()
  API_VERSION: number;
  @IsString()
  GENERIC_API: string;
  @IsString()
  API_URL: string;
  @IsString()
  DOMAIN_URL: string;
  @IsString()
  DASHBOARD_DOMAIN_URL: string;

  // Seed
  @IsString()
  ADMIN_EMAIL: string;
  @IsString()
  ADMIN_PASSWORD: string;

  // Auth
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRATION_TIME: string;
  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
  @IsNumber()
  OTP_CODE_EXPIRE_TIME: number;

  // Database
  @IsString()
  DATABASE_URL: string;

  // Mail
  @IsString()
  MAIL_TRANSPORT_HOST: string;
  @IsString()
  MAIL_TRANSPORT_USER: string;
  @IsString()
  MAIL_TRANSPORT_PASSWORD: string;
  @IsString()
  MAIL_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
