import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuthToken } from '../types/custom-request.type';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: RequestWithAuthToken = context.switchToHttp().getRequest();

    return request.user;
  },
);