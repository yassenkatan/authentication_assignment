import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtServicePayload } from './jwt.interface';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string, options?: { secret?: string }): Promise<any> {
    return this.jwtService.verifyAsync(token, options);
  }

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }
}
