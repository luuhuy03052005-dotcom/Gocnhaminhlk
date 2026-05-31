import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CurrentAdmin } from '../auth.service';

export type AdminRequest = Request & {
  admin?: CurrentAdmin;
};

export const CurrentAdminUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdmin | undefined => {
    const request = ctx.switchToHttp().getRequest<AdminRequest>();
    return request.admin;
  },
);
