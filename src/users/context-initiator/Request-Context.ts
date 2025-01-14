// src/decorators/request-context.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      user: request.user,
      ip: request.ip,
    };
  },
);
