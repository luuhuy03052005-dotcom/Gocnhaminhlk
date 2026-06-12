part of 'auth_bloc.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthOtpPending extends AuthState {
  final String maskedPhone;
  const AuthOtpPending(this.maskedPhone);

  @override
  List<Object?> get props => [maskedPhone];
}

class AuthAuthenticated extends AuthState {
  final AdminSession session;
  const AuthAuthenticated(this.session);

  @override
  List<Object?> get props => [session];
}

class AuthUnauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);

  @override
  List<Object?> get props => [message];
}
