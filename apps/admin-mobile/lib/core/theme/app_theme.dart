import 'package:flutter/material.dart';

/// Brand color palette — Góc Nhà Mình
/// Follows docs/07_UI_DESIGN_SYSTEM.md
abstract class AppColors {
  static const primary = Color(0xFFC8873A);   // caramel
  static const primaryDark = Color(0xFFA06828); // warmBrown
  static const background = Color(0xFFFDF6EE);  // cream
  static const surface = Color(0xFFFFFFFF);     // white
  static const surfaceAlt = Color(0xFFF5EDE0); // surface
  static const border = Color(0xFFEDE4D8);      // border
  static const textDark = Color(0xFF2C2017);   // coffeeDark
  static const textMuted = Color(0xFF7A6A55); // mutedText
  static const error = Color(0xFFD32F2F);
  static const success = Color(0xFF388E3C);
  static const warning = Color(0xFFF57C00);
  static const info = Color(0xFF1976D2);
}

/// Typography helpers
abstract class AppTextStyles {
  static const heading = TextStyle(
    fontFamily: 'serif',
    fontWeight: FontWeight.bold,
    color: AppColors.textDark,
  );

  static const title = TextStyle(
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.w600,
    fontSize: 18,
    color: AppColors.textDark,
  );

  static const body = TextStyle(
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.normal,
    fontSize: 14,
    color: AppColors.textDark,
  );

  static const bodyMuted = TextStyle(
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.normal,
    fontSize: 14,
    color: AppColors.textMuted,
  );

  static const label = TextStyle(
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.w500,
    fontSize: 12,
    color: AppColors.textMuted,
  );

  static const button = TextStyle(
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.bold,
    fontSize: 14,
    letterSpacing: 0.5,
  );
}
