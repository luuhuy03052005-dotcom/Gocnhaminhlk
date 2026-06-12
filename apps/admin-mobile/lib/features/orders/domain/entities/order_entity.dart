import 'package:equatable/equatable.dart';

class Order extends Equatable {
  final String id;
  final String orderNumber;
  final String userId;
  final String orderType; // DINE_IN | TAKE_AWAY | DELIVERY
  final String status; // PENDING | CONFIRMED | PREPARING | READY | COMPLETED | CANCELLED | REJECTED
  final List<OrderItem> items;
  final int subtotal;
  final int discountAmount;
  final int totalAmount;
  final String? note;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Order({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.orderType,
    required this.status,
    required this.items,
    required this.subtotal,
    required this.discountAmount,
    required this.totalAmount,
    this.note,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, orderNumber, userId, orderType, status, items,
        subtotal, discountAmount, totalAmount, note, createdAt, updatedAt,
      ];
}

class OrderItem extends Equatable {
  final String menuItemId;
  final String name;
  final int price;
  final int quantity;
  final String? note;

  const OrderItem({
    required this.menuItemId,
    required this.name,
    required this.price,
    required this.quantity,
    this.note,
  });

  @override
  List<Object?> get props => [menuItemId, name, price, quantity, note];
}
