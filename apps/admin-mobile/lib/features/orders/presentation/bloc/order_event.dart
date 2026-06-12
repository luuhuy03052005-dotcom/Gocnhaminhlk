part of 'order_bloc.dart';

abstract class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object?> get props => [];
}

class OrderLoadRequested extends OrderEvent {}

class OrderStatusUpdated extends OrderEvent {
  final String id;
  final String status;
  const OrderStatusUpdated(this.id, this.status);

  @override
  List<Object?> get props => [id, status];
}
