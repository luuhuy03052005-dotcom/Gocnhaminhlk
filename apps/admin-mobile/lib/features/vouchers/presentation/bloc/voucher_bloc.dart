import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/voucher_repository.dart';
import '../../domain/entities/voucher_entity.dart';

part 'voucher_event.dart';
part 'voucher_state.dart';

class VoucherBloc extends Bloc<VoucherEvent, VoucherState> {
  final VoucherRepository _repository;

  VoucherBloc(this._repository) : super(VoucherInitial()) {
    on<VoucherLoadRequested>(_onLoadRequested);
    on<VoucherCreated>(_onCreated);
    on<VoucherUpdated>(_onUpdated);
    on<VoucherDeleted>(_onDeleted);
  }

  Future<void> _onLoadRequested(
    VoucherLoadRequested event,
    Emitter<VoucherState> emit,
  ) async {
    emit(VoucherLoading());
    try {
      final vouchers = await _repository.getAll();
      emit(VoucherLoaded(vouchers));
    } catch (e) {
      emit(VoucherError(e.toString()));
    }
  }

  Future<void> _onCreated(
    VoucherCreated event,
    Emitter<VoucherState> emit,
  ) async {
    try {
      await _repository.create(event.input);
      add(VoucherLoadRequested());
    } catch (e) {
      emit(VoucherError(e.toString()));
    }
  }

  Future<void> _onUpdated(
    VoucherUpdated event,
    Emitter<VoucherState> emit,
  ) async {
    try {
      await _repository.update(event.id, event.input);
      add(VoucherLoadRequested());
    } catch (e) {
      emit(VoucherError(e.toString()));
    }
  }

  Future<void> _onDeleted(
    VoucherDeleted event,
    Emitter<VoucherState> emit,
  ) async {
    try {
      await _repository.delete(event.id);
      add(VoucherLoadRequested());
    } catch (e) {
      emit(VoucherError(e.toString()));
    }
  }
}
