import { Module } from '@nestjs/common';
import { ServerConstantService } from './server-constant.service';

@Module({
  imports: [],
  providers: [ServerConstantService],
  exports: [ServerConstantService],
})
export class ServerConstantModule {}
