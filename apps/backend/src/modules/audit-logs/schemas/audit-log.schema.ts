import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({
  collection: 'audit_logs',
  timestamps: { createdAt: true, updatedAt: false },
})
export class AuditLog {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Admin', index: true })
  actorAdminId: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  action: string;

  @Prop({ required: true, trim: true, index: true })
  targetType: string;

  @Prop({ type: Types.ObjectId, index: true })
  targetId?: Types.ObjectId;

  @Prop({ type: Object })
  before?: Record<string, unknown>;

  @Prop({ type: Object })
  after?: Record<string, unknown>;

  @Prop({ trim: true })
  ipAddress?: string;

  @Prop({ trim: true })
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

