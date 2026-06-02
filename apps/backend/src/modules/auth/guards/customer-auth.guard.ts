import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { AuthService } from '../auth.service';
import { CustomerRequest } from '../decorators/current-customer.decorator';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomerRequest>();
    const decodedToken = await this.authService.verifyBearerToken(
      request.headers.authorization,
    );

    const isCustomerLoginEnabled = await this.featureFlagsService.isEnabled('CUSTOMER_LOGIN');
    if (!isCustomerLoginEnabled) {
      throw new ForbiddenException({
        error: 'FEATURE_DISABLED',
        message: 'Customer login is disabled.',
        details: {
          featureFlag: 'CUSTOMER_LOGIN',
        },
      });
    }

    request.customer = await this.authService.resolveCustomerFromVerifiedToken(
      decodedToken,
    );

    return true;
  }
}
