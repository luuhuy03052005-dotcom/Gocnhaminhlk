import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/notification_repository.dart';
import '../../../notifications/domain/entities/notification_entity.dart';

part 'notification_event.dart';
part 'notification_state.dart';

class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final NotificationRepository _repository;

  NotificationBloc(this._repository) : super(NotificationInitial()) {
    on<NotificationLoadRequested>(_onLoadRequested);
    on<NotificationCreated>(_onCreated);
  }

  Future<void> _onLoadRequested(
    NotificationLoadRequested event,
    Emitter<NotificationState> emit,
  ) async {
    emit(NotificationLoading());
    try {
      final notifications = await _repository.getAll();
      emit(NotificationLoaded(notifications));
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  Future<void> _onCreated(
    NotificationCreated event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      await _repository.create(event.input);
      add(NotificationLoadRequested());
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }
}
