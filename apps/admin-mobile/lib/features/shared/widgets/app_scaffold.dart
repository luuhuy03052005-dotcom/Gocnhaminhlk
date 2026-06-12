import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/presentation/bloc/auth_bloc.dart';
import 'order_status_badge.dart';
import 'voucher_status_badge.dart';
import 'common_widgets.dart';

class AppScaffold extends StatelessWidget {
  final Widget child;

  const AppScaffold({super.key, required this.child});

  static const _tabs = [
    ('/dashboard', Icons.dashboard_outlined, Icons.dashboard, 'Dashboard'),
    ('/menu', Icons.restaurant_menu_outlined, Icons.restaurant_menu, 'Thực đơn'),
    ('/vouchers', Icons.local_offer_outlined, Icons.local_offer, 'Voucher'),
    ('/orders', Icons.receipt_long_outlined, Icons.receipt_long, 'Đơn hàng'),
    ('/settings', Icons.settings_outlined, Icons.settings, 'Cài đặt'),
  ];

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final currentIndex = _tabs.indexWhere(
      (t) => location == t.$1 || location.startsWith('${t.$1}/'),
    ).clamp(0, _tabs.length - 1);

    return Scaffold(
      body: child,
      drawer: _buildDrawer(context),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (index) {
          context.go(_tabs[index].$1);
        },
        backgroundColor: AppColors.surface,
        indicatorColor: AppColors.primary.withOpacity(0.15),
        destinations: _tabs.map((t) {
          return NavigationDestination(
            icon: Icon(t.$2, color: AppColors.textMuted),
            selectedIcon: Icon(t.$3, color: AppColors.primary),
            label: t.$4,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    final session =
        authState is AuthAuthenticated ? authState.session : null;

    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: AppColors.primary,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.white24,
                    child: Icon(Icons.person, color: Colors.white, size: 32),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    session?.fullName ?? 'Quản trị viên',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    session?.phoneNumber ?? '',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      session?.role ?? 'ADMIN',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Nav items
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _drawerItem(
                    context,
                    Icons.notifications_outlined,
                    'Thông báo',
                    '/notifications',
                  ),
                  _drawerItem(
                    context,
                    Icons.history,
                    'Nhật ký hành động',
                    '/audit-logs',
                  ),
                  const Divider(),
                  _drawerItem(
                    context,
                    Icons.person_outline,
                    'Hồ sơ cá nhân',
                    '/profile',
                  ),
                ],
              ),
            ),

            // Logout
            ListTile(
              leading: const Icon(Icons.logout, color: AppColors.error),
              title: const Text(
                'Đăng xuất',
                style: TextStyle(color: AppColors.error),
              ),
              onTap: () {
                Navigator.pop(context);
                context.read<AuthBloc>().add(AuthLogoutRequested());
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _drawerItem(
    BuildContext context,
    IconData icon,
    String label,
    String route,
  ) {
    return ListTile(
      leading: Icon(icon, color: AppColors.textMuted),
      title: Text(label),
      onTap: () {
        Navigator.pop(context);
        context.push(route);
      },
    );
  }
}
