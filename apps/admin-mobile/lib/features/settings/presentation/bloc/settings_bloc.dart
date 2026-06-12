import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/settings_repository.dart';
import '../../../settings/domain/entities/feature_flag_entity.dart';
import '../../../settings/domain/entities/system_setting_entity.dart';
import '../../../settings/domain/entities/audit_log_entity.dart';

part 'settings_event.dart';
part 'settings_state.dart';

class FeatureFlagBloc extends Bloc<FeatureFlagEvent, FeatureFlagState> {
  final SettingsRepository _repository;

  FeatureFlagBloc(this._repository) : super(FeatureFlagInitial()) {
    on<FeatureFlagLoadRequested>(_onLoadRequested);
    on<FeatureFlagToggled>(_onToggled);
  }

  Future<void> _onLoadRequested(
    FeatureFlagLoadRequested event,
    Emitter<FeatureFlagState> emit,
  ) async {
    emit(FeatureFlagLoading());
    try {
      final flags = await _repository.getFeatureFlags();
      emit(FeatureFlagLoaded(flags));
    } catch (e) {
      emit(FeatureFlagError(e.toString()));
    }
  }

  Future<void> _onToggled(
    FeatureFlagToggled event,
    Emitter<FeatureFlagState> emit,
  ) async {
    try {
      await _repository.updateFeatureFlag(event.key, event.enabled);
      add(FeatureFlagLoadRequested());
    } catch (e) {
      emit(FeatureFlagError(e.toString()));
    }
  }
}

class SystemSettingBloc extends Bloc<SystemSettingEvent, SystemSettingState> {
  final SettingsRepository _repository;

  SystemSettingBloc(this._repository) : super(SystemSettingInitial()) {
    on<SystemSettingLoadRequested>(_onLoadRequested);
    on<SystemSettingUpdated>(_onUpdated);
  }

  Future<void> _onLoadRequested(
    SystemSettingLoadRequested event,
    Emitter<SystemSettingState> emit,
  ) async {
    emit(SystemSettingLoading());
    try {
      final settings = await _repository.getSystemSettings();
      emit(SystemSettingLoaded(settings));
    } catch (e) {
      emit(SystemSettingError(e.toString()));
    }
  }

  Future<void> _onUpdated(
    SystemSettingUpdated event,
    Emitter<SystemSettingState> emit,
  ) async {
    try {
      await _repository.updateSystemSetting(event.key, event.input);
      add(SystemSettingLoadRequested());
    } catch (e) {
      emit(SystemSettingError(e.toString()));
    }
  }
}

class AuditLogBloc extends Bloc<AuditLogEvent, AuditLogState> {
  final SettingsRepository _repository;

  AuditLogBloc(this._repository) : super(AuditLogInitial()) {
    on<AuditLogLoadRequested>(_onLoadRequested);
  }

  Future<void> _onLoadRequested(
    AuditLogLoadRequested event,
    Emitter<AuditLogState> emit,
  ) async {
    emit(AuditLogLoading());
    try {
      final logs = await _repository.getAuditLogs(
        page: event.page,
        limit: event.limit,
      );
      emit(AuditLogLoaded(logs));
    } catch (e) {
      emit(AuditLogError(e.toString()));
    }
  }
}
