part of 'settings_bloc.dart';

abstract class FeatureFlagState extends Equatable {
  const FeatureFlagState();

  @override
  List<Object?> get props => [];
}

class FeatureFlagInitial extends FeatureFlagState {}

class FeatureFlagLoading extends FeatureFlagState {}

class FeatureFlagLoaded extends FeatureFlagState {
  final List<FeatureFlag> flags;
  const FeatureFlagLoaded(this.flags);

  @override
  List<Object?> get props => [flags];
}

class FeatureFlagError extends FeatureFlagState {
  final String message;
  const FeatureFlagError(this.message);

  @override
  List<Object?> get props => [message];
}

abstract class SystemSettingState extends Equatable {
  const SystemSettingState();

  @override
  List<Object?> get props => [];
}

class SystemSettingInitial extends SystemSettingState {}

class SystemSettingLoading extends SystemSettingState {}

class SystemSettingLoaded extends SystemSettingState {
  final List<SystemSetting> settings;
  const SystemSettingLoaded(this.settings);

  @override
  List<Object?> get props => [settings];
}

class SystemSettingError extends SystemSettingState {
  final String message;
  const SystemSettingError(this.message);

  @override
  List<Object?> get props => [message];
}

abstract class AuditLogState extends Equatable {
  const AuditLogState();

  @override
  List<Object?> get props => [];
}

class AuditLogInitial extends AuditLogState {}

class AuditLogLoading extends AuditLogState {}

class AuditLogLoaded extends AuditLogState {
  final List<AuditLog> logs;
  const AuditLogLoaded(this.logs);

  @override
  List<Object?> get props => [logs];
}

class AuditLogError extends AuditLogState {
  final String message;
  const AuditLogError(this.message);

  @override
  List<Object?> get props => [message];
}
