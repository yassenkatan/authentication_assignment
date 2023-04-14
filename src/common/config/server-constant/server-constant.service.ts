import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Injectable()
export class ServerConstantService {
  constructor(private readonly config: EnvironmentConfigService) {}

  getBaseUrl(): string {
    const serverProtocol = this.config.getServerProtocol();
    const serverHost = this.config.getServerHostname();
    const serverPort = this.config.getServerPort();
    return `${serverProtocol}://${serverHost}:${serverPort}`;
  }

  getGenericUrlPrefix(): string {
    const genericApi = this.config.getGenericAPI();
    const apiVersion = this.config.getAPIVersion();
    return `${genericApi}/v${apiVersion}`;
  }

  getPostgresDateFormat(): string {
    return 'yyyy-MM-dd HH:mm:ssx';
  }
}
