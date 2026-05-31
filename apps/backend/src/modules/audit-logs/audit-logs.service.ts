import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface CreateAuditLogInput {
  actorAdminId: string | Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: string | Types.ObjectId;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  create(input: CreateAuditLogInput) {
    return this.auditLogModel.create({
      actorAdminId: this.toObjectId(input.actorAdminId),
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ? this.toObjectId(input.targetId) : undefined,
      before: input.before,
      after: input.after,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  findLatest(limit = 50) {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}

