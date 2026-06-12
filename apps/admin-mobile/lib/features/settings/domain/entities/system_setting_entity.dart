import 'package:equatable/equatable.dart';

class SystemSetting extends Equatable {
  final String id;
  final String key;
  final dynamic value;
  final String? description;
  final String? updatedByAdminId;
  final DateTime createdAt;
  final DateTime updatedAt;

  const SystemSetting({
    required this.id,
    required this.key,
    this.value,
    this.description,
    this.updatedByAdminId,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, key, value, description,
        updatedByAdminId, createdAt, updatedAt,
      ];
}
