import 'package:equatable/equatable.dart';

class Voucher extends Equatable {
  final String id;
  final String title;
  final String? description;
  final String type; // PERCENT | FIXED_AMOUNT
  final int value;
  final int? minOrderAmount;
  final int? maxDiscountAmount;
  final DateTime startDate;
  final DateTime endDate;
  final int? quantity;
  final String status; // ACTIVE | INACTIVE | EXPIRED | LOCKED
  final DateTime createdAt;
  final DateTime updatedAt;

  const Voucher({
    required this.id,
    required this.title,
    this.description,
    required this.type,
    required this.value,
    this.minOrderAmount,
    this.maxDiscountAmount,
    required this.startDate,
    required this.endDate,
    this.quantity,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isExpired => endDate.isBefore(DateTime.now());
  bool get isActive => status == 'ACTIVE' && !isExpired;

  @override
  List<Object?> get props => [
        id, title, description, type, value,
        minOrderAmount, maxDiscountAmount,
        startDate, endDate, quantity, status,
        createdAt, updatedAt,
      ];
}
