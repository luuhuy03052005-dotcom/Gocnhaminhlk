import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tổng quan',
              style: AppTextStyles.heading.copyWith(fontSize: 22),
            ),
            const SizedBox(height: 16),
            _buildStatGrid(),
            const SizedBox(height: 24),
            _buildQuickActions(context),
          ],
        ),
      ),
    );
  }

  Widget _buildStatGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: const [
        _StatCard(label: 'Người dùng', value: '—', icon: Icons.people),
        _StatCard(label: 'Đơn hàng', value: '—', icon: Icons.receipt),
        _StatCard(label: 'Voucher', value: '—', icon: Icons.local_offer),
        _StatCard(label: 'Banner', value: '—', icon: Icons.image),
      ],
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Thao tác nhanh', style: AppTextStyles.title),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _QuickAction(
              label: 'Thực đơn',
              icon: Icons.restaurant_menu,
              onTap: () => context.go('/menu'),
            ),
            _QuickAction(
              label: 'Voucher',
              icon: Icons.local_offer,
              onTap: () => context.go('/vouchers'),
            ),
            _QuickAction(
              label: 'Banner',
              icon: Icons.image,
              onTap: () => context.push('/cms/banners'),
            ),
            _QuickAction(
              label: 'Đơn hàng',
              icon: Icons.receipt_long,
              onTap: () => context.go('/orders'),
            ),
            _QuickAction(
              label: 'Thông báo',
              icon: Icons.notifications,
              onTap: () => context.push('/notifications'),
            ),
            _QuickAction(
              label: 'Cài đặt',
              icon: Icons.settings,
              onTap: () => context.go('/settings'),
            ),
          ],
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: AppColors.primary, size: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: AppTextStyles.heading.copyWith(fontSize: 24),
              ),
              Text(label, style: AppTextStyles.label),
            ],
          ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _QuickAction({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            Text(label, style: AppTextStyles.body),
          ],
        ),
      ),
    );
  }
}
