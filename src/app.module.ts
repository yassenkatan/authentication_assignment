import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/admin-user.module';
import { AdminProductModule } from './product/admin-product.module';
import { AdminAuthModule } from './auth/admin-auth.module';
import { SeederModule } from './common/seeder/seeder.module';
import { EnvironmentConfigModule } from './common/config/environment-config/environment-config.module';
import { ServerConstantModule } from './common/config/server-constant/server-constant.module';
import { EventModule } from './common/event/event.module';
import { MailModule } from './common/services/mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './common/files/file.module';
import { BcryptModule } from './common/services/bcrypt/bcrypt.module';
import { LocalStrategy } from './common/strategies/local.strategy';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './common/strategies/jwtRefresh.strategy';
import { ClientAuthModule } from './auth/client-auth.module';
import { ClientUserModule } from './user/client-user.module';
import { ExceptionsModule } from './common/exceptions/exceptions.module';
import { ClientProductModule } from './product/client-product.module';
import { join } from 'path';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      exclude: ['api*'],
      serveRoot: '/public',
      serveStaticOptions: {
        index: false,
      },
    }),
    {
      module: EnvironmentConfigModule,
      global: true,
    },
    {
      module: ServerConstantModule,
      global: true,
    },
    {
      module: EventModule,
      global: true,
    },
    {
      module: MailModule,
      global: true,
    },
    { module: SeederModule, global: true },
    {
      module: BcryptModule,
      global: true,
    },
    {
      module: ExceptionsModule,
      global: true,
    },
    {
      module: EmailModule,
      global: true,
    },
    FileModule,
    AdminUserModule,
    ClientUserModule,
    ClientAuthModule,
    AdminAuthModule,
    ClientProductModule,
    AdminProductModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
