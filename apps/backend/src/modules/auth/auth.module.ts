import { Module } from '@nestjs/common';
import { AdminsModule } from '../admins/admins.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, AdminsModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
