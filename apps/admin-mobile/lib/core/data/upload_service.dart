import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';

class UploadResult {
  final String id;
  final String url;
  final String secureUrl;
  final String folder;

  UploadResult({
    required this.id,
    required this.url,
    required this.secureUrl,
    required this.folder,
  });

  factory UploadResult.fromJson(Map<String, dynamic> e) {
    return UploadResult(
      id: e['id'] as String,
      url: e['url'] as String,
      secureUrl: e['secureUrl'] as String,
      folder: e['folder'] as String,
    );
  }
}

class UploadService {
  static const _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );

  final Dio _dio;

  UploadService() : _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  ));

  Future<UploadResult> uploadImage({
    required String filePath,
    required String folder,
    String fileName = 'upload',
  }) async {
    final user = FirebaseAuth.instance.currentUser;
    final token = user != null ? await user.getIdToken() : null;

    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath, filename: fileName),
      'folder': folder,
    });

    final res = await _dio.post(
      '/admin/upload',
      data: formData,
      options: Options(
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ),
    );

    return UploadResult.fromJson(res.data['data'] as Map<String, dynamic>);
  }
}
