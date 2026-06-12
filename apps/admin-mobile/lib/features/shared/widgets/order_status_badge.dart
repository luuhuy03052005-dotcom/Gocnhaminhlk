import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

Widget buildOrderStatusBadge(String status) {
  Color bg, text;
  switch (status) {
    case 'PENDING':
      bg = AppColors.warning.withOpacity(0.15);
      text = AppColors.warning;
      break;
    case 'CONFIRMED':
      bg = AppColors.info.withOpacity(0.15);
      text = AppColors.info;
      break;
    case 'PREPARING':
      bg = Colors.purple.withOpacity(0.15);
      text = Colors.purple;
      break;
    case 'READY':
      bg = AppColors.primary.withOpacity(0.15);
      text = AppColors.primary;
      break;
    case 'COMPLETED':
      bg = AppColors.success.withOpacity(0.15);
      text = AppColors.success;
      break;
    case 'CANCELLED':
    case 'REJECTED':
      bg = AppColors.error.withOpacity(0.15);
      text = AppColors.error;
      break;
    default:
      bg = AppColors.surfaceAlt;
      text = AppColors.textMuted;
  }
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
    child: Text(
      status,
      style: TextStyle(
        color: text,
        fontSize: 12,
        fontWeight: FontWeight.w600,
      ),
    ),
  );
}

String formatVnd(int amount) {
  final str = amount.toString();
  final buffer = StringBuffer();
  for (var i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 == 0) {
      buffer.write(',');
    }
    buffer.write(str[i]);
  }
  return '$bufferđ';
}
