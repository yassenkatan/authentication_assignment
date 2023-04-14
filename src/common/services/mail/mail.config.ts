import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';

export const getMailModuleOptions = (
  config: EnvironmentConfigService,
): MailerOptions => {
  return {
    transport: {
      host: config.getMailTransportHost(),
      port: Number(config.getMailTransportPort()),
      auth: {
        user: config.getMailTransportUser(),
        pass: config.getMailTransportPassword(),
      },
    },
    defaults: {
      from: config.getMailTransportUser(),
    },
    template: {
      dir: join(__dirname, '../../../email/templates/'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
