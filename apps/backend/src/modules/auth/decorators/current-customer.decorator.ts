import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CurrentCustomer } from '../auth.service';

export type CustomerRequest = Request & {
  customer?: CurrentCustomer;
};

export const CurrentCustomerUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentCustomer | undefined => {
    const request = ctx.switchToHttp().getRequest<CustomerRequest>();
    return request.customer;
  },
);
