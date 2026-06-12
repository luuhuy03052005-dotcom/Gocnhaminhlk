import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/settings/domain/entities/feature_flag_entity.dart';
import 'package:goc_nha_minh_admin/features/settings/domain/entities/system_setting_entity.dart';
import 'package:goc_nha_minh_admin/features/settings/domain/entities/audit_log_entity.dart';

class SettingsRepository {
  final ApiService _api;

  SettingsRepository(this._api);

  Future<List<FeatureFlag>> getFeatureFlags() async {
    final res = await _api.get('/admin/feature-flags');
    final data = res.data['data'] as List;
    return data.map((e) => _parseFeatureFlag(e as Map<String, dynamic>)).toList();
  }

  Future<FeatureFlag> updateFeatureFlag(String key, bool enabled) async {
    final res = await _api.patch('/admin/feature-flags/$key', data: {'enabled': enabled});
    return _parseFeatureFlag(res.data['data'] as Map<String, dynamic>);
  }

  Future<List<SystemSetting>> getSystemSettings() async {
    final res = await _api.get('/admin/system-settings');
    final data = res.data['data'] as List;
    return data.map((e) => _parseSystemSetting(e as Map<String, dynamic>)).toList();
  }

  Future<SystemSetting> updateSystemSetting(String key, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/system-settings/$key', data: input);
    return _parseSystemSetting(res.data['data'] as Map<String, dynamic>);
  }

  Future<List<AuditLog>> getAuditLogs({int page = 1, int limit = 20}) async {
    final res = await _api.get('/admin/audit-logs', queryParameters: {'page': page, 'limit': limit});
    final data = res.data['data'] as List;
    return data.map((e) => _parseAuditLog(e as Map<String, dynamic>)).toList();
  }

  FeatureFlag _parseFeatureFlag(Map<String, dynamic> e) {
    return FeatureFlag(
      id: e['id'] as String,
      key: e['key'] as String,
      description: e['description'] as String? ?? '',
      enabled: e['enabled'] as bool? ?? false,
      updatedByAdminId: e['updatedByAdminId'] as String?,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }

  SystemSetting _parseSystemSetting(Map<String, dynamic> e) {
    return SystemSetting(
      id: e['id'] as String,
      key: e['key'] as String,
      value: e['value'],
      description: e['description'] as String?,
      updatedByAdminId: e['updatedByAdminId'] as String?,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }

  AuditLog _parseAuditLog(Map<String, dynamic> e) {
    return AuditLog(
      id: e['id'] as String,
      action: e['action'] as String,
      entityType: e['entityType'] as String,
      entityId: e['entityId'] as String?,
      performedByAdminId: e['performedByAdminId'] as String?,
      performedByAdminName: e['performedByAdminName'] as String?,
      details: e['details'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(e['createdAt'] as String),
    );
  }
}
