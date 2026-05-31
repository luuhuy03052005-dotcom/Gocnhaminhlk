import { Module } from '@nestjs/common';
import { AdminsModule } from '../admins/admins.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [UsersModule, AdminsModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, PermissionGuard],
  exports: [AuthService, AdminAuthGuard, PermissionGuard],
})
export class AuthModule {}
