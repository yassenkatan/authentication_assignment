import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: EnvironmentConfigService,
    private readonly bcrypt: BcryptService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const password = this.config.getAdminPassword();
    const salt = await this.bcrypt.genSalt();
    const hashedPassword = await this.bcrypt.hash(password, salt);

    await this.userRepository.createAdminUser({
      email: this.config.getAdminEmail()?.toLowerCase(),
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
    });
  }
}
