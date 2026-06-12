import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/notification_repository.dart';
import '../bloc/notification_bloc.dart';
import '../../../shared/widgets/common_widgets.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => NotificationBloc(context.read<NotificationRepository>())
        ..add(NotificationLoadRequested()),
      child: const _NotificationsView(),
    );
  }
}

class _NotificationsView extends StatelessWidget {
  const _NotificationsView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông báo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCreateForm(context),
          ),
        ],
      ),
      body: BlocBuilder<NotificationBloc, NotificationState>(
        builder: (context, state) {
          if (state is NotificationLoading) {
            return const LoadingShimmer();
          }
          if (state is NotificationError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<NotificationBloc>().add(NotificationLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is NotificationLoaded) {
            if (state.notifications.isEmpty) {
              return EmptyState(
                icon: Icons.notifications_none,
                title: 'Chưa có thông báo',
                subtitle: 'Gửi thông báo đầu tiên',
                action: ElevatedButton.icon(
                  onPressed: () => _showCreateForm(context),
                  icon: const Icon(Icons.add),
                  label: const Text('Tạo thông báo'),
                ),
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<NotificationBloc>().add(NotificationLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.notifications.length,
                itemBuilder: (context, index) {
                  final n = state.notifications[index];
                  return _NotificationCard(notification: n);
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateForm(context),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCreateForm(BuildContext context) {
    final titleController = TextEditingController();
    final contentController = TextEditingController();
    String selectedType = 'SYSTEM';
    String selectedTarget = 'ALL';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetCtx) {
        return StatefulBuilder(
          builder: (ctx, setState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Tạo thông báo', style: AppTextStyles.title),
                      IconButton(
                        onPressed: () => Navigator.pop(ctx),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Tiêu đề',
                      hintText: 'VD: Khuyến mãi cuối tuần',
                    ),
                    textCapitalization: TextCapitalization.sentences,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: contentController,
                    decoration: const InputDecoration(
                      labelText: 'Nội dung',
                      hintText: 'VD: Giảm 20% cho tất cả đơn hàng',
                    ),
                    maxLines: 3,
                    textCapitalization: TextCapitalization.sentences,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedType,
                    decoration: const InputDecoration(labelText: 'Loại thông báo'),
                    items: const [
                      DropdownMenuItem(value: 'SYSTEM', child: Text('Hệ thống')),
                      DropdownMenuItem(value: 'PROMOTION', child: Text('Khuyến mãi')),
                      DropdownMenuItem(value: 'ORDER', child: Text('Đơn hàng')),
                      DropdownMenuItem(value: 'VOUCHER', child: Text('Voucher')),
                    ],
                    onChanged: (v) => setState(() => selectedType = v!),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedTarget,
                    decoration: const InputDecoration(labelText: 'Gửi đến'),
                    items: const [
                      DropdownMenuItem(value: 'ALL', child: Text('Tất cả người dùng')),
                      DropdownMenuItem(value: 'USER', child: Text('Người dùng cụ thể')),
                    ],
                    onChanged: (v) => setState(() => selectedTarget = v!),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      if (titleController.text.trim().isEmpty ||
                          contentController.text.trim().isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Vui lòng điền đầy đủ thông tin')),
                        );
                        return;
                      }
                      final input = <String, dynamic>{
                        'title': titleController.text.trim(),
                        'content': contentController.text.trim(),
                        'type': selectedType,
                        'targetType': selectedTarget,
                      };
                      context.read<NotificationBloc>().add(NotificationCreated(input));
                      Navigator.pop(ctx);
                    },
                    child: const Text('Gửi thông báo'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _NotificationCard extends StatelessWidget {
  final dynamic notification;

  const _NotificationCard({required this.notification});

  static const _typeLabels = {
    'SYSTEM': 'Hệ thống',
    'PROMOTION': 'Khuyến mãi',
    'ORDER': 'Đơn hàng',
    'VOUCHER': 'Voucher',
  };

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');
    final typeLabel = _typeLabels[notification.type] ?? notification.type;
    final isPromotion = notification.type == 'PROMOTION';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isPromotion
                        ? Colors.purple.withOpacity(0.1)
                        : AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isPromotion ? Icons.campaign : Icons.notifications,
                        size: 14,
                        color: isPromotion ? Colors.purple : AppColors.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        typeLabel,
                        style: TextStyle(
                          color: isPromotion ? Colors.purple : AppColors.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: notification.targetType == 'ALL'
                        ? AppColors.success.withOpacity(0.1)
                        : AppColors.surfaceAlt,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    notification.targetType == 'ALL' ? 'Tất cả' : 'Người dùng',
                    style: TextStyle(
                      fontSize: 11,
                      color: notification.targetType == 'ALL'
                          ? AppColors.success
                          : AppColors.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              notification.title,
              style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            Text(
              notification.content,
              style: AppTextStyles.bodyMuted,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.access_time, size: 12, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Text(
                  dateFormat.format(notification.createdAt),
                  style: AppTextStyles.label,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
