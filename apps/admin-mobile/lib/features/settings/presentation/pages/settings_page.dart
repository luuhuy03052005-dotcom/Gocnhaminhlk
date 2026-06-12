import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _SettingsTile(
            icon: Icons.flag_outlined,
            title: 'Feature Flags',
            subtitle: 'Bật/tắt tính năng',
            onTap: () => context.push('/feature-flags'),
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.settings_outlined,
            title: 'System Settings',
            subtitle: 'Cài đặt hệ thống',
            onTap: () => context.push('/system-settings'),
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.image_outlined,
            title: 'Banners',
            subtitle: 'Quản lý banner',
            onTap: () => context.push('/cms/banners'),
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.photo_library_outlined,
            title: 'Gallery',
            subtitle: 'Quản lý thư viện ảnh',
            onTap: () => context.push('/cms/gallery'),
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.article_outlined,
            title: 'Website Content',
            subtitle: 'Nội dung website',
            onTap: () => context.push('/cms/website-content'),
          ),
          const SizedBox(height: 24),
          _SettingsTile(
            icon: Icons.history,
            title: 'Audit Logs',
            subtitle: 'Nhật ký hành động',
            onTap: () => context.push('/audit-logs'),
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title, style: AppTextStyles.body),
        subtitle: Text(subtitle, style: AppTextStyles.bodyMuted),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
        onTap: onTap,
      ),
    );
  }
}
