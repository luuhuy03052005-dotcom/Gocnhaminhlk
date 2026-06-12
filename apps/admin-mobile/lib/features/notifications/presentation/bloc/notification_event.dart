part of 'notification_bloc.dart';

abstract class NotificationEvent extends Equatable {
  const NotificationEvent();

  @override
  List<Object?> get props => [];
}

class NotificationLoadRequested extends NotificationEvent {}

class NotificationCreated extends NotificationEvent {
  final Map<String, dynamic> input;
  const NotificationCreated(this.input);

  @override
  List<Object?> get props => [input];
}
