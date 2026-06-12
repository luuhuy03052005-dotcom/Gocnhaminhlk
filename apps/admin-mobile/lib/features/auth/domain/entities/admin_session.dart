import 'package:equatable/equatable.dart';

/// Admin session data from backend /auth/session endpoint
class AdminSession extends Equatable {
  final String id;
  final String firebaseUid;
  final String phoneNumber;
  final String fullName;
  final String role;

  const AdminSession({
    required this.id,
    required this.firebaseUid,
    required this.phoneNumber,
    required this.fullName,
    required this.role,
  });

  @override
  List<Object?> get props => [id, firebaseUid, phoneNumber, fullName, role];
}
