part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {}

class AuthSendOtpRequested extends AuthEvent {
  final String phone;
  const AuthSendOtpRequested(this.phone);

  @override
  List<Object?> get props => [phone];
}

class AuthOtpSent extends AuthEvent {
  final String maskedPhone;
  const AuthOtpSent(this.maskedPhone);

  @override
  List<Object?> get props => [maskedPhone];
}

class AuthVerifyOtpRequested extends AuthEvent {
  final String otp;
  const AuthVerifyOtpRequested(this.otp);

  @override
  List<Object?> get props => [otp];
}

class AuthOtpVerified extends AuthEvent {}

class AuthLogoutRequested extends AuthEvent {}

class AuthErrorOccurred extends AuthEvent {
  final String message;
  const AuthErrorOccurred(this.message);

  @override
  List<Object?> get props => [message];
}
