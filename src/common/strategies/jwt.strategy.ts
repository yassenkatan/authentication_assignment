import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { TokenPayload } from 'src/auth/models/token-payload.model';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: EnvironmentConfigService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authService.validateUserForJWTStrategy(
      payload.email,
    );

    if (!user) {
      this.exceptionService.unauthorizedException({
        message: 'unAuthorized',
      });
    }

    return user;
  }
}
