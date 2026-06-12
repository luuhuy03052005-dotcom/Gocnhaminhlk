import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/settings_repository.dart';
import '../bloc/settings_bloc.dart';
import '../../../shared/widgets/common_widgets.dart';

class AuditLogsPage extends StatelessWidget {
  const AuditLogsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => AuditLogBloc(context.read<SettingsRepository>())
        ..add(const AuditLogLoadRequested()),
      child: const _AuditLogsView(),
    );
  }
}

class _AuditLogsView extends StatelessWidget {
  const _AuditLogsView();

  static const _actionColors = {
    'CREATE': Colors.green,
    'UPDATE': Colors.blue,
    'DELETE': Colors.red,
    'PATCH': Colors.purple,
    'LOGIN': Colors.teal,
    'LOGOUT': Colors.orange,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Audit Logs'),
        automaticallyImplyLeading: false,
      ),
      body: BlocBuilder<AuditLogBloc, AuditLogState>(
        builder: (context, state) {
          if (state is AuditLogLoading) {
            return const LoadingShimmer();
          }
          if (state is AuditLogError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<AuditLogBloc>().add(const AuditLogLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is AuditLogLoaded) {
            if (state.logs.isEmpty) {
              return const EmptyState(
                icon: Icons.history,
                title: 'Không có nhật ký',
                subtitle: 'Chưa có hành động nào được ghi lại',
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<AuditLogBloc>().add(const AuditLogLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.logs.length,
                itemBuilder: (context, index) {
                  final log = state.logs[index];
                  final color = _actionColors[log.action.toUpperCase()] ?? AppColors.textMuted;

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
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: color.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  log.action,
                                  style: TextStyle(
                                    color: color,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceAlt,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  log.entityType,
                                  style: AppTextStyles.label,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          if (log.entityId != null) ...[
                            Text(
                              'ID: ${log.entityId}',
                              style: AppTextStyles.bodyMuted.copyWith(fontSize: 12),
                            ),
                            const SizedBox(height: 4),
                          ],
                          if (log.performedByAdminName != null) ...[
                            Row(
                              children: [
                                const Icon(Icons.person_outline,
                                    size: 14, color: AppColors.textMuted),
                                const SizedBox(width: 4),
                                Text(
                                  log.performedByAdminName!,
                                  style: AppTextStyles.bodyMuted.copyWith(fontSize: 12),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                          ],
                          Row(
                            children: [
                              const Icon(Icons.access_time,
                                  size: 14, color: AppColors.textMuted),
                              const SizedBox(width: 4),
                              Text(
                                DateFormat('dd/MM/yyyy HH:mm').format(log.createdAt),
                                style: AppTextStyles.label,
                              ),
                            ],
                          ),
                          if (log.details != null &&
                              (log.details!['changes'] != null ||
                                  log.details!['oldValue'] != null)) ...[
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceAlt,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                log.details.toString(),
                                style: AppTextStyles.bodyMuted.copyWith(
                                  fontSize: 11,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
