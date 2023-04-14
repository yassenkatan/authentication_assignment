import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    return req;
  }
}
