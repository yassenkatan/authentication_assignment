import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { getMailModuleOptions } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvironmentConfigService],
      useFactory: getMailModuleOptions,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
