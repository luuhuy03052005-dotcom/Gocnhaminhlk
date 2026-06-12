import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/voucher_repository.dart';
import '../bloc/voucher_bloc.dart';
import '../../domain/entities/voucher_entity.dart';
import '../../../shared/widgets/common_widgets.dart';
import '../../../shared/widgets/voucher_status_badge.dart';
import '../../../shared/widgets/order_status_badge.dart';

class VouchersPage extends StatelessWidget {
  const VouchersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => VoucherBloc(context.read<VoucherRepository>())..add(VoucherLoadRequested()),
      child: const _VouchersView(),
    );
  }
}

class _VouchersView extends StatefulWidget {
  const _VouchersView();

  @override
  State<_VouchersView> createState() => _VouchersViewState();
}

class _VouchersViewState extends State<_VouchersView> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const _filterTabs = ['Tất cả', 'Đang hoạt động', 'Ngừng', 'Hết hạn'];
  int _selectedTab = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _filterTabs.length, vsync: this);
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

  List<Voucher> _filterVouchers(List<Voucher> vouchers) {
    switch (_selectedTab) {
      case 1:
        return vouchers.where((v) => v.status == 'ACTIVE' && !v.isExpired).toList();
      case 2:
        return vouchers.where((v) => v.status == 'INACTIVE').toList();
      case 3:
        return vouchers.where((v) => v.isExpired).toList();
      default:
        return vouchers;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mã giảm giá'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showVoucherForm(context, null),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.primary,
          isScrollable: true,
          tabs: _filterTabs.map((t) => Tab(text: t)).toList(),
        ),
      ),
      body: BlocBuilder<VoucherBloc, VoucherState>(
        builder: (context, state) {
          if (state is VoucherLoading) {
            return const LoadingShimmer();
          }
          if (state is VoucherError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () => context.read<VoucherBloc>().add(VoucherLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is VoucherLoaded) {
            final vouchers = _filterVouchers(state.vouchers);
            if (vouchers.isEmpty) {
              return EmptyState(
                icon: Icons.local_offer_outlined,
                title: _selectedTab == 0 ? 'Chưa có mã giảm giá' : 'Không có mã nào',
                subtitle: _selectedTab == 0
                    ? 'Tạo mã giảm giá đầu tiên'
                    : 'Không có mã nào trong danh mục này',
                action: _selectedTab == 0
                    ? ElevatedButton.icon(
                        onPressed: () => _showVoucherForm(context, null),
                        icon: const Icon(Icons.add),
                        label: const Text('Tạo mã giảm giá'),
                      )
                    : null,
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<VoucherBloc>().add(VoucherLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: vouchers.length,
                itemBuilder: (context, index) {
                  final voucher = vouchers[index];
                  return _VoucherCard(
                    voucher: voucher,
                    onEdit: () => _showVoucherForm(context, voucher),
                    onDelete: () => _confirmDelete(context, voucher),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showVoucherForm(context, null),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showVoucherForm(BuildContext context, Voucher? voucher) {
    final isEdit = voucher != null;
    final titleController = TextEditingController(text: voucher?.title ?? '');
    final descController = TextEditingController(text: voucher?.description ?? '');
    final valueController = TextEditingController(text: voucher?.value.toString() ?? '');
    final minOrderController = TextEditingController(
      text: voucher?.minOrderAmount?.toString() ?? '',
    );
    final maxDiscountController = TextEditingController(
      text: voucher?.maxDiscountAmount?.toString() ?? '',
    );
    final quantityController = TextEditingController(
      text: voucher?.quantity?.toString() ?? '',
    );
    String selectedType = voucher?.type ?? 'PERCENT';
    String selectedStatus = voucher?.status ?? 'ACTIVE';
    DateTime startDate = voucher?.startDate ?? DateTime.now();
    DateTime endDate = voucher?.endDate ?? DateTime.now().add(const Duration(days: 30));

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
            return DraggableScrollableSheet(
              initialChildSize: 0.9,
              minChildSize: 0.5,
              maxChildSize: 0.95,
              expand: false,
              builder: (_, scrollController) {
                return SingleChildScrollView(
                  controller: scrollController,
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
                          Text(isEdit ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá', style: AppTextStyles.title),
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
                          hintText: 'VD: Giảm 20% cuối tuần',
                        ),
                        textCapitalization: TextCapitalization.sentences,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: descController,
                        decoration: const InputDecoration(
                          labelText: 'Mô tả (tùy chọn)',
                          hintText: 'VD: Áp dụng cho đơn từ 100k',
                        ),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: selectedType,
                              decoration: const InputDecoration(labelText: 'Loại'),
                              items: const [
                                DropdownMenuItem(value: 'PERCENT', child: Text('Phần trăm (%)')),
                                DropdownMenuItem(value: 'FIXED_AMOUNT', child: Text('Số tiền cố định')),
                              ],
                              onChanged: (v) => setState(() => selectedType = v!),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: valueController,
                              decoration: const InputDecoration(
                                labelText: 'Giá trị',
                                hintText: '10',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: minOrderController,
                              decoration: const InputDecoration(
                                labelText: 'Đơn tối thiểu (VNĐ)',
                                hintText: '0',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: maxDiscountController,
                              decoration: const InputDecoration(
                                labelText: 'Giảm tối đa (VNĐ)',
                                hintText: '—',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: quantityController,
                        decoration: const InputDecoration(
                          labelText: 'Số lượng mã',
                          hintText: '100',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _DateField(
                              label: 'Ngày bắt đầu',
                              date: startDate,
                              onTap: () async {
                                final d = await showDatePicker(
                                  context: ctx,
                                  initialDate: startDate,
                                  firstDate: DateTime.now().subtract(const Duration(days: 365)),
                                  lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
                                );
                                if (d != null) setState(() => startDate = d);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _DateField(
                              label: 'Ngày kết thúc',
                              date: endDate,
                              onTap: () async {
                                final d = await showDatePicker(
                                  context: ctx,
                                  initialDate: endDate,
                                  firstDate: startDate,
                                  lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
                                );
                                if (d != null) setState(() => endDate = d);
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: selectedStatus,
                        decoration: const InputDecoration(labelText: 'Trạng thái'),
                        items: const [
                          DropdownMenuItem(value: 'ACTIVE', child: Text('Đang hoạt động')),
                          DropdownMenuItem(value: 'INACTIVE', child: Text('Ngừng')),
                          DropdownMenuItem(value: 'LOCKED', child: Text('Khóa')),
                        ],
                        onChanged: (v) => setState(() => selectedStatus = v!),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          final title = titleController.text.trim();
                          final value = int.tryParse(valueController.text);
                          if (title.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Tiêu đề không được trống')),
                            );
                            return;
                          }
                          if (value == null || value <= 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Giá trị không hợp lệ')),
                            );
                            return;
                          }
                          final input = <String, dynamic>{
                            'title': title,
                            'description': descController.text.trim(),
                            'type': selectedType,
                            'value': value,
                            'minOrderAmount': int.tryParse(minOrderController.text),
                            'maxDiscountAmount': int.tryParse(maxDiscountController.text),
                            'quantity': int.tryParse(quantityController.text),
                            'status': selectedStatus,
                            'startDate': startDate.toIso8601String(),
                            'endDate': endDate.toIso8601String(),
                          };
                          if (isEdit) {
                            context.read<VoucherBloc>().add(VoucherUpdated(voucher.id, input));
                          } else {
                            context.read<VoucherBloc>().add(VoucherCreated(input));
                          }
                          Navigator.pop(ctx);
                        },
                        child: Text(isEdit ? 'Lưu thay đổi' : 'Tạo mã giảm giá'),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  void _confirmDelete(BuildContext context, Voucher voucher) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa mã giảm giá'),
        content: Text('Xóa "${voucher.title}"? Hành động này không thể hoàn tác.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Hủy')),
          TextButton(
            onPressed: () {
              context.read<VoucherBloc>().add(VoucherDeleted(voucher.id));
              Navigator.pop(ctx);
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }
}

class _VoucherCard extends StatelessWidget {
  final Voucher voucher;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _VoucherCard({
    required this.voucher,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');
    final isPercent = voucher.type == 'PERCENT';
    final valueLabel = isPercent
        ? '${voucher.value}%'
        : formatVnd(voucher.value);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onEdit,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.local_offer, color: AppColors.primary, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          valueLabel,
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: isPercent
                          ? Colors.purple.withOpacity(0.1)
                          : Colors.teal.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      isPercent ? 'Phần trăm' : 'Số tiền',
                      style: TextStyle(
                        color: isPercent ? Colors.purple : Colors.teal,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const Spacer(),
                  buildVoucherStatusBadge(voucher.status),
                ],
              ),
              const SizedBox(height: 12),
              Text(voucher.title, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
              if (voucher.description != null && voucher.description!.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  voucher.description!,
                  style: AppTextStyles.bodyMuted,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildInfoChip(
                    Icons.calendar_today,
                    '${dateFormat.format(voucher.startDate)} - ${dateFormat.format(voucher.endDate)}',
                  ),
                  if (voucher.minOrderAmount != null) ...[
                    const SizedBox(width: 8),
                    _buildInfoChip(Icons.shopping_cart, 'Từ ${formatVnd(voucher.minOrderAmount!)}'),
                  ],
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: onEdit,
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    label: const Text('Sửa'),
                    style: TextButton.styleFrom(foregroundColor: AppColors.primary),
                  ),
                  TextButton.icon(
                    onPressed: onDelete,
                    icon: const Icon(Icons.delete_outline, size: 18),
                    label: const Text('Xóa'),
                    style: TextButton.styleFrom(foregroundColor: AppColors.error),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppColors.textMuted),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }
}

class _DateField extends StatelessWidget {
  final String label;
  final DateTime date;
  final VoidCallback onTap;

  const _DateField({
    required this.label,
    required this.date,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final fmt = DateFormat('dd/MM/yyyy');
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          suffixIcon: const Icon(Icons.calendar_today, size: 18),
        ),
        child: Text(fmt.format(date), style: AppTextStyles.body),
      ),
    );
  }
}
