import 'package:equatable/equatable.dart';

class AdminNotification extends Equatable {
  final String id;
  final String title;
  final String content;
  final String type; // SYSTEM | PROMOTION | ORDER | VOUCHER
  final String targetType; // ALL | USER | GROUP
  final List<String> targetUserIds;
  final DateTime createdAt;

  const AdminNotification({
    required this.id,
    required this.title,
    required this.content,
    required this.type,
    required this.targetType,
    this.targetUserIds = const [],
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, title, content, type, targetType, targetUserIds, createdAt];
}
