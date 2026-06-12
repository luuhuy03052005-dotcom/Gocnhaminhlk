import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/menu_repository.dart';
import '../bloc/menu_bloc.dart';
import '../../domain/entities/menu_entities.dart';
import '../../../shared/widgets/common_widgets.dart';
import '../../../shared/widgets/order_status_badge.dart';

class MenuItemsPage extends StatefulWidget {
  const MenuItemsPage({super.key});

  @override
  State<MenuItemsPage> createState() => _MenuItemsPageState();
}

class _MenuItemsPageState extends State<MenuItemsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const _tabs = ['Tất cả', 'Còn hàng', 'Hết hàng'];
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() => _selectedIndex = _tabController.index);
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<MenuItem> _filterItems(List<MenuItem> items) {
    switch (_selectedIndex) {
      case 1:
        return items.where((i) => i.isAvailable).toList();
      case 2:
        return items.where((i) => !i.isAvailable).toList();
      default:
        return items;
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => MenuBloc(context.read<MenuRepository>())..add(MenuLoadRequested()),
      child: Builder(
        builder: (context) => Scaffold(
          appBar: AppBar(
            title: const Text('Món'),
            automaticallyImplyLeading: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => _showItemForm(context, null, []),
              ),
            ],
            bottom: TabBar(
              controller: _tabController,
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textMuted,
              indicatorColor: AppColors.primary,
              tabs: _tabs.map((t) => Tab(text: t)).toList(),
            ),
          ),
          body: BlocBuilder<MenuBloc, MenuState>(
            builder: (context, state) {
              if (state is MenuLoading) {
                return const LoadingShimmer();
              }
              if (state is MenuError) {
                return EmptyState(
                  icon: Icons.error_outline,
                  title: 'Lỗi tải dữ liệu',
                  subtitle: state.message,
                  action: ElevatedButton(
                    onPressed: () => context.read<MenuBloc>().add(MenuLoadRequested()),
                    child: const Text('Thử lại'),
                  ),
                );
              }
              if (state is MenuLoaded) {
                final items = _filterItems(state.items);
                if (items.isEmpty) {
                  return EmptyState(
                    icon: Icons.restaurant_outlined,
                    title: _selectedIndex == 0 ? 'Chưa có món' : 'Không có món nào',
                    subtitle: _selectedIndex == 0
                        ? 'Thêm món đầu tiên vào thực đơn'
                        : 'Không có món nào trong danh mục này',
                    action: _selectedIndex == 0
                        ? ElevatedButton.icon(
                            onPressed: () => _showItemForm(context, null, state.categories),
                            icon: const Icon(Icons.add),
                            label: const Text('Thêm món'),
                          )
                        : null,
                  );
                }
                return RefreshIndicator(
                  onRefresh: () async {
                    context.read<MenuBloc>().add(MenuLoadRequested());
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      final category = state.categories
                          .where((c) => c.id == item.categoryId)
                          .firstOrNull;
                      return _ItemCard(
                        item: item,
                        categoryName: category?.name,
                        onEdit: () => _showItemForm(context, item, state.categories),
                        onToggleAvailability: () {
                          context.read<MenuBloc>().add(MenuItemUpdated(
                            item.id,
                            {'isAvailable': !item.isAvailable},
                          ));
                        },
                      );
                    },
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),
          floatingActionButton: BlocBuilder<MenuBloc, MenuState>(
            builder: (context, state) {
              final categories = state is MenuLoaded ? state.categories : <MenuCategory>[];
              return FloatingActionButton(
                onPressed: () => _showItemForm(context, null, categories),
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                child: const Icon(Icons.add),
              );
            },
          ),
        ),
      ),
    );
  }

  void _showItemForm(BuildContext context, MenuItem? item, List<MenuCategory> categories) {
    if (categories.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng thêm danh mục trước')),
      );
      return;
    }

    final isEdit = item != null;
    final nameController = TextEditingController(text: item?.name ?? '');
    final descController = TextEditingController(text: item?.description ?? '');
    final priceController = TextEditingController(
      text: item?.price.toString() ?? '',
    );
    String? selectedCategoryId = item?.categoryId ?? categories.first.id;
    var isAvailable = item?.isAvailable ?? true;
    var isBestSeller = item?.isBestSeller ?? false;

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
              initialChildSize: 0.85,
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
                          Text(isEdit ? 'Sửa món' : 'Thêm món', style: AppTextStyles.title),
                          IconButton(
                            onPressed: () => Navigator.pop(ctx),
                            icon: const Icon(Icons.close),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: nameController,
                        decoration: const InputDecoration(
                          labelText: 'Tên món',
                          hintText: 'VD: Cà phê sữa',
                        ),
                        textCapitalization: TextCapitalization.words,
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: selectedCategoryId,
                        decoration: const InputDecoration(labelText: 'Danh mục'),
                        items: categories.map((c) {
                          return DropdownMenuItem(value: c.id, child: Text(c.name));
                        }).toList(),
                        onChanged: (v) => setState(() => selectedCategoryId = v),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: priceController,
                        decoration: const InputDecoration(
                          labelText: 'Giá (VNĐ)',
                          hintText: '25000',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: descController,
                        decoration: const InputDecoration(
                          labelText: 'Mô tả (tùy chọn)',
                          hintText: 'VD: Hương vị đậm đà...',
                        ),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 12),
                      SwitchListTile(
                        title: const Text('Còn hàng'),
                        value: isAvailable,
                        onChanged: (v) => setState(() => isAvailable = v),
                        activeColor: AppColors.primary,
                        contentPadding: EdgeInsets.zero,
                      ),
                      SwitchListTile(
                        title: const Text('Món bán chạy'),
                        value: isBestSeller,
                        onChanged: (v) => setState(() => isBestSeller = v),
                        activeColor: AppColors.primary,
                        contentPadding: EdgeInsets.zero,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          final name = nameController.text.trim();
                          final price = int.tryParse(priceController.text);
                          if (name.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Tên món không được trống')),
                            );
                            return;
                          }
                          if (price == null || price < 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Giá không hợp lệ')),
                            );
                            return;
                          }
                          final input = <String, dynamic>{
                            'name': name,
                            'categoryId': selectedCategoryId,
                            'price': price,
                            'description': descController.text.trim(),
                            'isAvailable': isAvailable,
                            'isBestSeller': isBestSeller,
                          };
                          if (isEdit) {
                            context.read<MenuBloc>().add(MenuItemUpdated(item.id, input));
                          } else {
                            context.read<MenuBloc>().add(MenuItemCreated(input));
                          }
                          Navigator.pop(ctx);
                        },
                        child: Text(isEdit ? 'Lưu thay đổi' : 'Tạo món'),
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
}

class _ItemCard extends StatelessWidget {
  final MenuItem item;
  final String? categoryName;
  final VoidCallback onEdit;
  final VoidCallback onToggleAvailability;

  const _ItemCard({
    required this.item,
    this.categoryName,
    required this.onEdit,
    required this.onToggleAvailability,
  });

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(item.id),
      direction: DismissDirection.endToStart,
      background: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppColors.error,
          borderRadius: BorderRadius.circular(12),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      confirmDismiss: (_) async {
        return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Xóa món'),
            content: Text('Xóa "${item.name}" khỏi thực đơn?'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: TextButton.styleFrom(foregroundColor: AppColors.error),
                child: const Text('Xóa'),
              ),
            ],
          ),
        );
      },
      onDismissed: (_) {
        context.read<MenuBloc>().add(MenuItemDeleted(item.id));
      },
      child: Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: InkWell(
          onTap: onEdit,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceAlt,
                    borderRadius: BorderRadius.circular(10),
                    image: item.imageUrl != null
                        ? DecorationImage(
                            image: NetworkImage(item.imageUrl!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: item.imageUrl == null
                      ? const Icon(Icons.restaurant, color: AppColors.textMuted, size: 28)
                      : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.name,
                              style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (item.isBestSeller)
                            Container(
                              margin: const EdgeInsets.only(left: 6),
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                'Bán chạy',
                                style: TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      if (categoryName != null)
                        Text(
                          categoryName!,
                          style: AppTextStyles.bodyMuted.copyWith(fontSize: 12),
                        ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            formatVnd(item.price),
                            style: AppTextStyles.body.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: item.isAvailable
                                  ? AppColors.success.withOpacity(0.15)
                                  : AppColors.error.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              item.isAvailable ? 'Còn hàng' : 'Hết hàng',
                              style: TextStyle(
                                color: item.isAvailable ? AppColors.success : AppColors.error,
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert, color: AppColors.textMuted),
                  onSelected: (value) {
                    if (value == 'edit') onEdit();
                    if (value == 'toggle') onToggleAvailability();
                  },
                  itemBuilder: (_) => [
                    const PopupMenuItem(value: 'edit', child: Row(
                      children: [
                        Icon(Icons.edit_outlined, size: 20),
                        SizedBox(width: 8),
                        Text('Sửa'),
                      ],
                    )),
                    PopupMenuItem(value: 'toggle', child: Row(
                      children: [
                        Icon(
                          item.isAvailable ? Icons.visibility_off : Icons.visibility,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(item.isAvailable ? 'Ẩn món' : 'Hiện món'),
                      ],
                    )),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
