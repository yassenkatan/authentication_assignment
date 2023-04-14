import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from '../common/config/environment-config/environment-config.service';
import { MailModule } from '../common/services/mail/mail.module';
import { MailService } from '../common/services/mail/mail.service';
import { EmailService } from './email.service';

@Module({
  imports: [MailModule],
  providers: [
    {
      provide: EmailService,
      inject: [EnvironmentConfigService, MailService],
      useFactory: (
        config: EnvironmentConfigService,
        mailService: MailService,
      ) => new EmailService(config, mailService),
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
