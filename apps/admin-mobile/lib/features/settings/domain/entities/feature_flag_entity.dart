import 'package:equatable/equatable.dart';

class FeatureFlag extends Equatable {
  final String id;
  final String key;
  final String description;
  final bool enabled;
  final String? updatedByAdminId;
  final DateTime createdAt;
  final DateTime updatedAt;

  const FeatureFlag({
    required this.id,
    required this.key,
    required this.description,
    required this.enabled,
    this.updatedByAdminId,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, key, description, enabled,
        updatedByAdminId, createdAt, updatedAt,
      ];
}
