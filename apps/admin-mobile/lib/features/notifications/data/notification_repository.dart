import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/notifications/domain/entities/notification_entity.dart';

class NotificationRepository {
  final ApiService _api;

  NotificationRepository(this._api);

  Future<List<AdminNotification>> getAll() async {
    final res = await _api.get('/admin/notifications');
    final data = res.data['data'] as List;
    return data.map((e) => _parse(e as Map<String, dynamic>)).toList();
  }

  Future<AdminNotification> create(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/notifications', data: input);
    return _parse(res.data['data'] as Map<String, dynamic>);
  }

  AdminNotification _parse(Map<String, dynamic> e) {
    return AdminNotification(
      id: e['id'] as String,
      title: e['title'] as String,
      content: e['content'] as String,
      type: e['type'] as String,
      targetType: e['targetType'] as String,
      targetUserIds: (e['targetUserIds'] as List?)
              ?.map((i) => i as String)
              .toList() ??
          [],
      createdAt: DateTime.parse(e['createdAt'] as String),
    );
  }
}
