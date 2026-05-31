import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }])],
  providers: [AuditLogsService, AuditLogInterceptor],
  exports: [AuditLogsService, AuditLogInterceptor],
})
export class AuditLogsModule {}
