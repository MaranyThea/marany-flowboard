import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type AuthenticatedRequest = {
  user?: unknown;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
