import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExceptionsService } from '../exceptions/exceptions.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({ usernameField: 'email' } as IStrategyOptions);
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.exceptionService.badRequestException({
        message: 'unAuthorized',
      });
    }

    const user = await this.authService.validateUserForLocalStrategy(
      email,
      password,
    );

    if (!user) {
      this.exceptionService.badRequestException({
        message: 'User not found',
      });
    }
    return user;
  }
}
