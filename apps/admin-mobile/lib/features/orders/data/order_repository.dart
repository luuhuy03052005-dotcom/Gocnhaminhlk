import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/orders/domain/entities/order_entity.dart';

class OrderRepository {
  final ApiService _api;

  OrderRepository(this._api);

  Future<List<Order>> getAll() async {
    final res = await _api.get('/admin/orders');
    final data = res.data['data'] as List;
    return data.map((e) => _parse(e as Map<String, dynamic>)).toList();
  }

  Future<Order> updateStatus(String id, String status) async {
    final res = await _api.patch('/admin/orders/$id/status', data: {'status': status});
    return _parse(res.data['data'] as Map<String, dynamic>);
  }

  Order _parse(Map<String, dynamic> e) {
    return Order(
      id: e['id'] as String,
      orderNumber: e['orderNumber'] as String,
      userId: e['userId'] as String,
      orderType: e['orderType'] as String,
      status: e['status'] as String,
      items: (e['items'] as List?)
          ?.map((i) => OrderItem(
                menuItemId: i['menuItemId'] as String,
                name: i['name'] as String,
                price: (i['price'] as num).toInt(),
                quantity: (i['quantity'] as num).toInt(),
                note: i['note'] as String?,
              ))
          .toList() ?? [],
      subtotal: (e['subtotal'] as num).toInt(),
      discountAmount: (e['discountAmount'] as num).toInt(),
      totalAmount: (e['totalAmount'] as num).toInt(),
      note: e['note'] as String?,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }
}
