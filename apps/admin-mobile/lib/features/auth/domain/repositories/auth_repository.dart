import 'package:dartz/dartz.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../entities/admin_session.dart';

abstract class AuthRepository {
  Future<Either<String, AdminSession>> createSession(User user);
  Future<Option<AdminSession>> getStoredSession();
  Future<void> clearSession();
  Stream<User?> authStateChanges();
}
