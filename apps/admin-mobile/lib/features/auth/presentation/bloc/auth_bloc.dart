import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../domain/entities/admin_session.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _repository;
  ConfirmationResult? _confirmationResult;
  String? _maskedPhone;

  AuthBloc(this._repository) : super(AuthInitial()) {
    on<AuthCheckRequested>(_onCheckRequested);
    on<AuthSendOtpRequested>(_onSendOtpRequested);
    on<AuthOtpSent>(_onOtpSent);
    on<AuthVerifyOtpRequested>(_onVerifyOtpRequested);
    on<AuthOtpVerified>(_onOtpVerified);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthErrorOccurred>(_onErrorOccurred);
  }

  Future<void> _onCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final sessionOption = await _repository.getStoredSession();
    final session = sessionOption.fold(() => null, (s) => s);
    if (session != null) {
      emit(AuthAuthenticated(session));
    } else {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onSendOtpRequested(
    AuthSendOtpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final digits = event.phone.replaceAll(RegExp(r'\D'), '');
      final prefix = digits.startsWith('0')
          ? '+84${digits.substring(1)}'
          : (digits.startsWith('+') ? digits : '+$digits');

      _maskedPhone = event.phone.replaceAllMapped(
        RegExp(r'(\d{3})\d{4}(\d{3})'),
        (m) => '${m[1]}****${m[2]}',
      );

      _confirmationResult =
          await FirebaseAuth.instance.signInWithPhoneNumber(prefix);
      emit(AuthOtpPending(_maskedPhone!));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onOtpSent(
    AuthOtpSent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthOtpPending(event.maskedPhone));
  }

  Future<void> _onVerifyOtpRequested(
    AuthVerifyOtpRequested event,
    Emitter<AuthState> emit,
  ) async {
    if (_confirmationResult == null) {
      emit(const AuthError('NO_OTP_SENT'));
      return;
    }

    emit(AuthLoading());
    try {
      final credential = await _confirmationResult!.confirm(event.otp);
      final result = await _repository.createSession(credential.user!);
      result.fold(
        (err) => emit(AuthError(err)),
        (_) => add(AuthOtpVerified()),
      );
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onOtpVerified(
    AuthOtpVerified event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final sessionOption = await _repository.getStoredSession();
    final session = sessionOption.fold(() => null, (s) => s);
    if (session != null) {
      emit(AuthAuthenticated(session));
    } else {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _repository.clearSession();
    emit(AuthUnauthenticated());
  }

  Future<void> _onErrorOccurred(
    AuthErrorOccurred event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthError(event.message));
  }
}
