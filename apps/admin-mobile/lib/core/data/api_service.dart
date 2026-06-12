import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// Central HTTP client for all admin API calls.
/// Injects Firebase Bearer token automatically.
class ApiService {
  static const _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1', // Android emulator localhost
  );

  final Dio _dio;

  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Accept': 'application/json'},
  ));

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return _request<T>('GET', path, queryParameters: queryParameters);
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    return _request<T>('POST', path, data: data, queryParameters: queryParameters);
  }

  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    return _request<T>('PATCH', path, data: data, queryParameters: queryParameters);
  }

  Future<Response<T>> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return _request<T>('DELETE', path, queryParameters: queryParameters);
  }

  Future<Response<T>> _request<T>(
    String method,
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    final user = FirebaseAuth.instance.currentUser;
    final token = user != null ? await user.getIdToken() : null;

    return _dio.request<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: Options(
        method: method,
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ),
    );
  }
}

/// Handles API errors consistently.
class ApiException implements Exception {
  final String code;
  final String message;
  final int? statusCode;

  ApiException({required this.code, required this.message, this.statusCode});

  factory ApiException.fromDio(DioException e) {
    final data = e.response?.data;
    final errorBody = data is Map ? data['error'] as Map<String, dynamic>? : null;
    return ApiException(
      code: errorBody?['code'] ?? 'REQUEST_FAILED',
      message: errorBody?['message'] ?? e.message ?? 'Request failed',
      statusCode: e.response?.statusCode,
    );
  }

  @override
  String toString() => '[$code] $message';
}
