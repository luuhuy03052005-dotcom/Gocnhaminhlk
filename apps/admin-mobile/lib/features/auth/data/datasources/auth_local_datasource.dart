import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/entities/admin_session.dart';

class AuthLocalDatasource {
  static const _sessionKey = 'admin_session';
  final SharedPreferences _prefs;

  AuthLocalDatasource(this._prefs);

  Future<void> saveSession(AdminSession session) async {
    await _prefs.setString(_sessionKey, jsonEncode({
      'id': session.id,
      'firebaseUid': session.firebaseUid,
      'phoneNumber': session.phoneNumber,
      'fullName': session.fullName,
      'role': session.role,
    }));
  }

  AdminSession? getSession() {
    final raw = _prefs.getString(_sessionKey);
    if (raw == null) return null;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return AdminSession(
        id: map['id'] as String,
        firebaseUid: map['firebaseUid'] as String,
        phoneNumber: map['phoneNumber'] as String,
        fullName: map['fullName'] as String,
        role: map['role'] as String,
      );
    } catch (_) {
      return null;
    }
  }

  Future<void> clearSession() async {
    await _prefs.remove(_sessionKey);
  }
}
