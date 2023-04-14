import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';
import { EventTypes } from 'src/common/event/models/event.enum';
import {
  ExpiredVerificationTokenEventPayload,
  OTPCodeEventPayload,
} from 'src/common/event/models/event.payload';
import { MailService } from 'src/common/services/mail/mail.service';
import { UserModel } from 'src/user/models/user.model';

@Injectable()
export class EmailService {
  constructor(
    private readonly config: EnvironmentConfigService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(EventTypes.ResendConfirmationOTP)
  async sendVerificationMailOnResendRequest(
    expiredTokenPayload: ExpiredVerificationTokenEventPayload,
  ) {
    return this.sendVerificationMail(
      expiredTokenPayload?.user,
      expiredTokenPayload?.otpCode,
    );
  }

  @OnEvent(EventTypes.UserCreated)
  async sendVerificationMailOnUserCreated(
    otpCodeEventPayload: OTPCodeEventPayload,
  ) {
    return this.sendVerificationMail(
      otpCodeEventPayload?.user,
      otpCodeEventPayload?.otpCode,
    );
  }

  @OnEvent(EventTypes.ForgetPassword)
  async sendOTPCodeMailOnForgetPassword(otpCodePayload: OTPCodeEventPayload) {
    return this.sendOtpCode(otpCodePayload.user, otpCodePayload.otpCode);
  }

  private async sendVerificationMail(user: UserModel, otpCode: number) {
    return this.mailService.sendMail({
      from: this.config.getMailTransportUser(),
      subject: 'Email Confirmation',
      to: user?.email,
      template: './verification-mail.template.hbs',
      context: {
        otpCode: otpCode,
      },
    });
  }

  private async sendOtpCode(user: UserModel, otpCode: number) {
    return this.mailService.sendMail({
      from: this.config.getMailTransportUser(),
      subject: 'Resetting Password Code',
      to: user?.email,
      template: './otp-code-mail.template.hbs',
      context: {
        otpCode: otpCode,
      },
    });
  }
}
