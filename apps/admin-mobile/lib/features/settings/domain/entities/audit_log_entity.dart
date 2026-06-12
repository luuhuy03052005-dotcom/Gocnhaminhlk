import 'package:equatable/equatable.dart';

class AuditLog extends Equatable {
  final String id;
  final String action;
  final String entityType;
  final String? entityId;
  final String? performedByAdminId;
  final String? performedByAdminName;
  final Map<String, dynamic>? details;
  final DateTime createdAt;

  const AuditLog({
    required this.id,
    required this.action,
    required this.entityType,
    this.entityId,
    this.performedByAdminId,
    this.performedByAdminName,
    this.details,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id, action, entityType, entityId,
        performedByAdminId, performedByAdminName,
        details, createdAt,
      ];
}
