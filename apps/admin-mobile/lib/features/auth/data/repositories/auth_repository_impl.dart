import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/entities/admin_session.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthLocalDatasource _localDatasource;
  final Dio _dio;

  AuthRepositoryImpl(SharedPreferences prefs)
      : _localDatasource = AuthLocalDatasource(prefs),
        _dio = Dio(BaseOptions(
          baseUrl: const String.fromEnvironment(
            'API_BASE_URL',
            defaultValue: 'http://localhost:3000/api/v1',
          ),
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
        ));

  @override
  Future<Either<String, AdminSession>> createSession(User user) async {
    try {
      final idToken = await user.getIdToken();
      final response = await _dio.post(
        '/auth/session',
        data: {
          'firebaseIdToken': idToken,
          'clientType': 'ADMIN_APP',
        },
        options: Options(headers: {'Authorization': 'Bearer $idToken'}),
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final data = response.data['data'] as Map<String, dynamic>;
        final session = AdminSession(
          id: data['id'] as String,
          firebaseUid: data['firebaseUid'] as String,
          phoneNumber: data['phoneNumber'] as String,
          fullName: data['fullName'] as String,
          role: data['role'] as String,
        );
        await _localDatasource.saveSession(session);
        return Right(session);
      }

      return Left(response.data['error']?['message'] ?? 'Login failed');
    } on DioException catch (e) {
      return Left(e.response?.data?['error']?['message'] ?? 'Network error');
    } catch (e) {
      return Left(e.toString());
    }
  }

  @override
  Future<Option<AdminSession>> getStoredSession() async {
    final session = _localDatasource.getSession();
    return session != null ? Some(session) : const None();
  }

  @override
  Future<void> clearSession() async {
    await FirebaseAuth.instance.signOut();
    await _localDatasource.clearSession();
  }

  @override
  Stream<User?> authStateChanges() {
    return FirebaseAuth.instance.authStateChanges();
  }
}
