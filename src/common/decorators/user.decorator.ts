import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from 'src/user/models/user.model';

export const User = createParamDecorator(
  (prop: keyof UserModel, context: ExecutionContext) => {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const user = request?.user;
    return prop ? user?.[prop] : user;
  },
);
