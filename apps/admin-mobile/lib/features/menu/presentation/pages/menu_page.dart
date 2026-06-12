import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class MenuPage extends StatelessWidget {
  const MenuPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thực đơn'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/menu/items/new'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _MenuSectionCard(
            title: 'Danh mục',
            onTap: () => context.push('/menu/categories'),
            trailing: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: () => context.push('/menu/categories/new'),
                  tooltip: 'Thêm danh mục',
                ),
                IconButton(
                  icon: const Icon(Icons.list),
                  onPressed: () => context.push('/menu/categories'),
                  tooltip: 'Xem tất cả',
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _MenuSectionCard(
            title: 'Món',
            onTap: () => context.push('/menu/items'),
            trailing: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: () => context.push('/menu/items/new'),
                  tooltip: 'Thêm món',
                ),
                IconButton(
                  icon: const Icon(Icons.list),
                  onPressed: () => context.push('/menu/items'),
                  tooltip: 'Xem tất cả',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuSectionCard extends StatelessWidget {
  final String title;
  final VoidCallback onTap;
  final Widget trailing;

  const _MenuSectionCard({
    required this.title,
    required this.onTap,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.surfaceAlt,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.restaurant_menu, color: AppColors.primary),
        ),
        title: Text(title, style: AppTextStyles.title),
        subtitle: Text('Quản lý $title', style: AppTextStyles.bodyMuted),
        trailing: trailing,
        onTap: onTap,
      ),
    );
  }
}
