import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  // Base
  getServerProtocol(): string {
    return this.configService.get('SERVER_PROTOCOL');
  }

  getServerPort(): number {
    return this.configService.get('SERVER_PORT');
  }

  getServerHostname(): string {
    return this.configService.get('SERVER_HOSTNAME');
  }

  getAPIVersion(): number {
    return this.configService.get('API_VERSION');
  }

  getGenericAPI(): string {
    return this.configService.get('GENERIC_API');
  }

  getAPIUrl(): string {
    return this.configService.get('API_URL');
  }

  getDomainUrl(): string {
    return this.configService.get('DOMAIN_URL');
  }

  getDashboardDomainUrl(): string {
    return this.configService.get('DASHBOARD_DOMAIN_URL');
  }

  // Seed
  getAdminEmail(): string {
    return this.configService.get('ADMIN_EMAIL');
  }

  getAdminPassword(): string {
    return this.configService.get('ADMIN_PASSWORD');
  }

  // Auth
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getJwtVerificationSecret(): string {
    return this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET');
  }

  getJwtVerificationExpirationTime(): string {
    return this.configService.get<string>(
      'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
    );
  }

  getOTPCodeExpiationTime(): number {
    return this.configService.get('OTP_CODE_EXPIRE_TIME');
  }

  // Database
  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  // Mail
  getMailTransportHost(): string {
    return this.configService.get<string>('MAIL_TRANSPORT_HOST');
  }

  getMailTransportPort(): string {
    return this.configService.get('MAIL_TRANSPORT_PORT');
  }

  getMailTransportUser(): string {
    return this.configService.get<string>('MAIL_TRANSPORT_USER');
  }

  getMailTransportPassword(): string {
    return this.configService.get<string>('MAIL_TRANSPORT_PASSWORD');
  }

  getMailFrom(): string {
    return this.configService.get<string>('MAIL_FROM');
  }
}
