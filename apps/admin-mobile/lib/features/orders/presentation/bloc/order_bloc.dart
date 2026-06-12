import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/order_repository.dart';
import '../../domain/entities/order_entity.dart';

part 'order_event.dart';
part 'order_state.dart';

class OrderBloc extends Bloc<OrderEvent, OrderState> {
  final OrderRepository _repository;

  OrderBloc(this._repository) : super(OrderInitial()) {
    on<OrderLoadRequested>(_onLoadRequested);
    on<OrderStatusUpdated>(_onStatusUpdated);
  }

  Future<void> _onLoadRequested(
    OrderLoadRequested event,
    Emitter<OrderState> emit,
  ) async {
    emit(OrderLoading());
    try {
      final orders = await _repository.getAll();
      emit(OrderLoaded(orders));
    } catch (e) {
      emit(OrderError(e.toString()));
    }
  }

  Future<void> _onStatusUpdated(
    OrderStatusUpdated event,
    Emitter<OrderState> emit,
  ) async {
    final currentState = state;
    try {
      await _repository.updateStatus(event.id, event.status);
      if (currentState is OrderLoaded) {
        final orders = await _repository.getAll();
        emit(OrderLoaded(orders));
      } else {
        add(OrderLoadRequested());
      }
    } catch (e) {
      emit(OrderError(e.toString()));
    }
  }
}
