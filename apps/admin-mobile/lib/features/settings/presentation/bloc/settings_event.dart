part of 'settings_bloc.dart';

abstract class FeatureFlagEvent extends Equatable {
  const FeatureFlagEvent();

  @override
  List<Object?> get props => [];
}

class FeatureFlagLoadRequested extends FeatureFlagEvent {}

class FeatureFlagToggled extends FeatureFlagEvent {
  final String key;
  final bool enabled;
  const FeatureFlagToggled(this.key, this.enabled);

  @override
  List<Object?> get props => [key, enabled];
}

abstract class SystemSettingEvent extends Equatable {
  const SystemSettingEvent();

  @override
  List<Object?> get props => [];
}

class SystemSettingLoadRequested extends SystemSettingEvent {}

class SystemSettingUpdated extends SystemSettingEvent {
  final String key;
  final Map<String, dynamic> input;
  const SystemSettingUpdated(this.key, this.input);

  @override
  List<Object?> get props => [key, input];
}

abstract class AuditLogEvent extends Equatable {
  const AuditLogEvent();

  @override
  List<Object?> get props => [];
}

class AuditLogLoadRequested extends AuditLogEvent {
  final int page;
  final int limit;
  const AuditLogLoadRequested({this.page = 1, this.limit = 20});

  @override
  List<Object?> get props => [page, limit];
}
