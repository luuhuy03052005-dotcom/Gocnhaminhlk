import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/order_repository.dart';
import '../bloc/order_bloc.dart';
import '../../domain/entities/order_entity.dart';
import '../../../shared/widgets/common_widgets.dart';
import '../../../shared/widgets/order_status_badge.dart';

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => OrderBloc(context.read<OrderRepository>())..add(OrderLoadRequested()),
      child: const _OrdersView(),
    );
  }
}

class _OrdersView extends StatefulWidget {
  const _OrdersView();

  @override
  State<_OrdersView> createState() => _OrdersViewState();
}

class _OrdersViewState extends State<_OrdersView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const _statusTabs = [
    'Tất cả',
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
  ];

  static const _statusLabels = [
    'Tất cả',
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang chuẩn bị',
    'Sẵn sàng',
    'Hoàn thành',
    'Đã hủy',
  ];

  int _selectedTab = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _statusTabs.length, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() => _selectedTab = _tabController.index);
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Order> _filterOrders(List<Order> orders) {
    if (_selectedTab == 0) return orders;
    return orders.where((o) => o.status == _statusTabs[_selectedTab]).toList();
  }

  static const _validTransitions = {
    'PENDING': ['CONFIRMED', 'CANCELLED'],
    'CONFIRMED': ['PREPARING', 'CANCELLED'],
    'PREPARING': ['READY', 'CANCELLED'],
    'READY': ['COMPLETED'],
    'COMPLETED': [],
    'CANCELLED': [],
    'REJECTED': [],
  };

  List<String> _availableTransitions(String status) {
    return (_validTransitions[status] as List<String>?) ?? <String>[];
  }

  String _statusLabel(String status) {
    final idx = _statusTabs.indexOf(status);
    return idx >= 0 ? _statusLabels[idx] : status;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đơn hàng'),
        automaticallyImplyLeading: false,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.primary,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          tabs: List.generate(_statusTabs.length, (i) => Tab(text: _statusLabels[i])),
        ),
      ),
      body: BlocBuilder<OrderBloc, OrderState>(
        builder: (context, state) {
          if (state is OrderLoading) {
            return const LoadingShimmer();
          }
          if (state is OrderError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () => context.read<OrderBloc>().add(OrderLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is OrderLoaded) {
            final orders = _filterOrders(state.orders);
            if (orders.isEmpty) {
              return EmptyState(
                icon: Icons.receipt_long_outlined,
                title: _selectedTab == 0 ? 'Chưa có đơn hàng' : 'Không có đơn nào',
                subtitle: _selectedTab == 0
                    ? 'Đơn hàng sẽ xuất hiện ở đây'
                    : 'Không có đơn nào ở trạng thái này',
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<OrderBloc>().add(OrderLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return _OrderCard(
                    order: order,
                    statusLabel: _statusLabel(order.status),
                    transitions: _availableTransitions(order.status),
                    onStatusChange: (newStatus) {
                      context.read<OrderBloc>().add(OrderStatusUpdated(order.id, newStatus));
                    },
                    onTap: () => _showOrderDetail(context, order),
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

  void _showOrderDetail(BuildContext context, Order order) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetCtx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          minChildSize: 0.4,
          maxChildSize: 0.95,
          expand: false,
          builder: (_, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Chi tiết đơn hàng', style: AppTextStyles.title),
                      IconButton(
                        onPressed: () => Navigator.pop(sheetCtx),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildDetailRow('Mã đơn', order.orderNumber),
                  _buildDetailRow('Trạng thái', _statusLabel(order.status)),
                  _buildDetailRow(
                    'Hình thức',
                    order.orderType == 'DINE_IN'
                        ? 'Tại quán'
                        : order.orderType == 'TAKE_AWAY'
                            ? 'Mang đi'
                            : order.orderType == 'DELIVERY'
                                ? 'Giao hàng'
                                : order.orderType,
                  ),
                  _buildDetailRow('Ngày tạo', dateFormat.format(order.createdAt)),
                  const Divider(height: 24),
                  const Text('Danh sách món', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  ...order.items.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '${item.quantity}x',
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.name, style: AppTextStyles.body),
                              if (item.note != null && item.note!.isNotEmpty)
                                Text(
                                  item.note!,
                                  style: AppTextStyles.bodyMuted.copyWith(fontSize: 12),
                                ),
                            ],
                          ),
                        ),
                        Text(
                          formatVnd(item.price * item.quantity),
                          style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  )),
                  const Divider(height: 24),
                  _buildDetailRow('Tạm tính', formatVnd(order.subtotal)),
                  if (order.discountAmount > 0)
                    _buildDetailRow('Giảm giá', '-${formatVnd(order.discountAmount)}'),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Tổng cộng',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Text(
                        formatVnd(order.totalAmount),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  if (order.note != null && order.note!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceAlt,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Ghi chú', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text(order.note!, style: AppTextStyles.bodyMuted),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTextStyles.bodyMuted),
          Text(value, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  final String statusLabel;
  final List<String> transitions;
  final void Function(String) onStatusChange;
  final VoidCallback onTap;

  const _OrderCard({
    required this.order,
    required this.statusLabel,
    required this.transitions,
    required this.onStatusChange,
    required this.onTap,
  });

  static const _orderTypeLabels = {
    'DINE_IN': 'Tại quán',
    'TAKE_AWAY': 'Mang đi',
    'DELIVERY': 'Giao hàng',
  };

  String _statusLabelFor(String status) {
    const _labels = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    const _labelNames = ['Chờ xác nhận', 'Đã xác nhận', 'Đang chuẩn bị', 'Sẵn sàng', 'Hoàn thành', 'Đã hủy'];
    final idx = _labels.indexOf(status);
    return idx >= 0 ? _labelNames[idx] : status;
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
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
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      order.orderNumber,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceAlt,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      _orderTypeLabels[order.orderType] ?? order.orderType,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const Spacer(),
                  buildOrderStatusBadge(order.status),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 14, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    dateFormat.format(order.createdAt),
                    style: AppTextStyles.bodyMuted.copyWith(fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${order.items.length} món · ${formatVnd(order.totalAmount)}',
                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
              ),
              if (order.note != null && order.note!.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  'Ghi chú: ${order.note}',
                  style: AppTextStyles.bodyMuted.copyWith(fontSize: 12, fontStyle: FontStyle.italic),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              if (transitions.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: transitions.map((t) {
                    final label = _statusLabelFor(t);
                    final isCancel = t == 'CANCELLED';
                    return OutlinedButton(
                      onPressed: () => _confirmStatusChange(context, t, label),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: isCancel ? AppColors.error : AppColors.primary,
                        side: BorderSide(
                          color: isCancel ? AppColors.error : AppColors.primary,
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        visualDensity: VisualDensity.compact,
                      ),
                      child: Text(label, style: const TextStyle(fontSize: 12)),
                    );
                  }).toList(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _confirmStatusChange(BuildContext context, String newStatus, String label) {
    final isCancel = newStatus == 'CANCELLED';
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isCancel ? 'Hủy đơn hàng' : 'Cập nhật trạng thái'),
        content: Text(
          isCancel
              ? 'Hủy đơn ${order.orderNumber}? Không thể hoàn tác.'
              : 'Chuyển đơn ${order.orderNumber} sang "$label"?',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Hủy')),
          TextButton(
            onPressed: () {
              onStatusChange(newStatus);
              Navigator.pop(ctx);
            },
            style: TextButton.styleFrom(
              foregroundColor: isCancel ? AppColors.error : AppColors.primary,
            ),
            child: Text(isCancel ? 'Hủy đơn' : 'Xác nhận'),
          ),
        ],
      ),
    );
  }
}
