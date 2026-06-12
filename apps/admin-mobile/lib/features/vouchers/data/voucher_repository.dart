import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/vouchers/domain/entities/voucher_entity.dart';

class VoucherRepository {
  final ApiService _api;

  VoucherRepository(this._api);

  Future<List<Voucher>> getAll() async {
    final res = await _api.get('/admin/vouchers');
    final data = res.data['data'] as List;
    return data.map((e) => _parse(e as Map<String, dynamic>)).toList();
  }

  Future<Voucher> create(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/vouchers', data: input);
    return _parse(res.data['data'] as Map<String, dynamic>);
  }

  Future<Voucher> update(String id, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/vouchers/$id', data: input);
    return _parse(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> delete(String id) async {
    await _api.delete('/admin/vouchers/$id');
  }

  Voucher _parse(Map<String, dynamic> e) {
    return Voucher(
      id: e['id'] as String,
      title: e['title'] as String,
      description: e['description'] as String?,
      type: e['type'] as String,
      value: (e['value'] as num).toInt(),
      minOrderAmount: (e['minOrderAmount'] as num?)?.toInt(),
      maxDiscountAmount: (e['maxDiscountAmount'] as num?)?.toInt(),
      startDate: DateTime.parse(e['startDate'] as String),
      endDate: DateTime.parse(e['endDate'] as String),
      quantity: (e['quantity'] as num?)?.toInt(),
      status: e['status'] as String,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }
}
