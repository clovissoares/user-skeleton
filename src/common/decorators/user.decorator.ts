import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuthToken } from '../types/request-with-auth-token.type';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: RequestWithAuthToken = context.switchToHttp().getRequest();

    return request.user;
  }
);