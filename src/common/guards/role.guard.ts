import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { UserRole } from 'src/user/models/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly exceptionService: ExceptionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Array<UserRole>>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!roles || roles.length < 1) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    const res = this.matchRoles(roles, user?.userRole);
    if (!res) {
      this.exceptionService.unauthorizedException({
        message: 'UnAuthorized',
      });
    }
    return res;
  }

  matchRoles(roles: Array<UserRole>, userRole: UserRole): boolean {
    return roles.some((role) => role === userRole);
  }
}
