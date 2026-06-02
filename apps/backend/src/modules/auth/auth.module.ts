import { Module } from '@nestjs/common';
import { AdminsModule } from '../admins/admins.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [UsersModule, AdminsModule, RolesModule, FeatureFlagsModule],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, CustomerAuthGuard, PermissionGuard],
  exports: [AuthService, AdminAuthGuard, CustomerAuthGuard, PermissionGuard],
})
export class AuthModule {}
