import 'package:equatable/equatable.dart';

class WebsiteContent extends Equatable {
  final String key;
  final dynamic value;
  final bool isActive;
  final DateTime? updatedAt;

  const WebsiteContent({
    required this.key,
    this.value,
    this.isActive = true,
    this.updatedAt,
  });

  @override
  List<Object?> get props => [key, value, isActive, updatedAt];
}
