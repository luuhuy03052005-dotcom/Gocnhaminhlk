part of 'voucher_bloc.dart';

abstract class VoucherEvent extends Equatable {
  const VoucherEvent();

  @override
  List<Object?> get props => [];
}

class VoucherLoadRequested extends VoucherEvent {}

class VoucherCreated extends VoucherEvent {
  final Map<String, dynamic> input;
  const VoucherCreated(this.input);

  @override
  List<Object?> get props => [input];
}

class VoucherUpdated extends VoucherEvent {
  final String id;
  final Map<String, dynamic> input;
  const VoucherUpdated(this.id, this.input);

  @override
  List<Object?> get props => [id, input];
}

class VoucherDeleted extends VoucherEvent {
  final String id;
  const VoucherDeleted(this.id);

  @override
  List<Object?> get props => [id];
}
