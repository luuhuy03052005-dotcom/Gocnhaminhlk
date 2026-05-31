import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminRequest } from '../decorators/current-admin.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    request.admin = await this.authService.authenticateAdminBearer(
      request.headers.authorization,
    );

    return true;
  }
}
