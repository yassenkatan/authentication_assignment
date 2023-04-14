import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string;
    from?: string;
    subject: string;
    text?: string;
    html?: string;
    context?: { [name: string]: any };
    template?: string;
  }): Promise<void> {
    return this.mailerService.sendMail(options);
  }
}
