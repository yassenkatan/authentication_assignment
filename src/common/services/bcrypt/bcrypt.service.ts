import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  rounds = 10;

  async hash(hashString: string, salt?: string): Promise<string> {
    const saltOrRound = salt || this.rounds;
    return bcrypt.hash(hashString, saltOrRound);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async genSalt(): Promise<string> {
    return bcrypt.genSalt(this.rounds);
  }
}
