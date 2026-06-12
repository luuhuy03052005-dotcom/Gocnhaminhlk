import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

Widget buildVoucherStatusBadge(String status) {
  Color bg, text;
  switch (status) {
    case 'ACTIVE':
      bg = AppColors.success.withOpacity(0.15);
      text = AppColors.success;
      break;
    case 'INACTIVE':
      bg = AppColors.surfaceAlt;
      text = AppColors.textMuted;
      break;
    case 'EXPIRED':
      bg = AppColors.error.withOpacity(0.15);
      text = AppColors.error;
      break;
    case 'LOCKED':
      bg = AppColors.warning.withOpacity(0.15);
      text = AppColors.warning;
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
