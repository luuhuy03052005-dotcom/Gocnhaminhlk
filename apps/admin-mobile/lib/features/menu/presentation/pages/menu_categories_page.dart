import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/menu_repository.dart';
import '../bloc/menu_bloc.dart';
import '../../domain/entities/menu_entities.dart';
import '../../../shared/widgets/common_widgets.dart';

class MenuCategoriesPage extends StatelessWidget {
  const MenuCategoriesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => MenuBloc(context.read<MenuRepository>())..add(MenuLoadRequested()),
      child: const _MenuCategoriesView(),
    );
  }
}

class _MenuCategoriesView extends StatelessWidget {
  const _MenuCategoriesView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh mục'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCategoryForm(context, null),
          ),
        ],
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
            if (state.categories.isEmpty) {
              return EmptyState(
                icon: Icons.category_outlined,
                title: 'Chưa có danh mục',
                subtitle: 'Thêm danh mục đầu tiên để bắt đầu',
                action: ElevatedButton.icon(
                  onPressed: () => _showCategoryForm(context, null),
                  icon: const Icon(Icons.add),
                  label: const Text('Thêm danh mục'),
                ),
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<MenuBloc>().add(MenuLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.categories.length,
                itemBuilder: (context, index) {
                  final category = state.categories[index];
                  return _CategoryCard(
                    category: category,
                    onEdit: () => _showCategoryForm(context, category),
                    onDelete: () => _confirmDelete(context, category),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCategoryForm(context, null),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCategoryForm(BuildContext context, MenuCategory? category) {
    final isEdit = category != null;
    final nameController = TextEditingController(text: category?.name ?? '');
    final descController = TextEditingController(text: category?.description ?? '');
    final orderController = TextEditingController(
      text: category?.displayOrder.toString() ?? '0',
    );
    var isActive = category?.isActive ?? true;

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
                      Text(
                        isEdit ? 'Sửa danh mục' : 'Thêm danh mục',
                        style: AppTextStyles.title,
                      ),
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
                      labelText: 'Tên danh mục',
                      hintText: 'VD: Cà phê',
                    ),
                    textCapitalization: TextCapitalization.words,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descController,
                    decoration: const InputDecoration(
                      labelText: 'Mô tả (tùy chọn)',
                      hintText: 'VD: Các loại cà phê đặc biệt',
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: orderController,
                    decoration: const InputDecoration(
                      labelText: 'Thứ tự hiển thị',
                      hintText: '0',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 12),
                  SwitchListTile(
                    title: const Text('Đang hoạt động'),
                    value: isActive,
                    onChanged: (v) => setState(() => isActive = v),
                    activeColor: AppColors.primary,
                    contentPadding: EdgeInsets.zero,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      final name = nameController.text.trim();
                      if (name.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Tên danh mục không được trống')),
                        );
                        return;
                      }
                      final input = <String, dynamic>{
                        'name': name,
                        'description': descController.text.trim(),
                        'displayOrder': int.tryParse(orderController.text) ?? 0,
                        'isActive': isActive,
                      };
                      if (isEdit) {
                        context.read<MenuBloc>().add(MenuCategoryUpdated(category.id, input));
                      } else {
                        context.read<MenuBloc>().add(MenuCategoryCreated(input));
                      }
                      Navigator.pop(ctx);
                    },
                    child: Text(isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _confirmDelete(BuildContext context, MenuCategory category) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa danh mục'),
        content: Text('Bạn có chắc muốn xóa "${category.name}"? Hành động này không thể hoàn tác.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              context.read<MenuBloc>().add(MenuCategoryDeleted(category.id));
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

class _CategoryCard extends StatelessWidget {
  final MenuCategory category;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _CategoryCard({
    required this.category,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onEdit,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.category, color: AppColors.primary),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(category.name, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
                    if (category.description != null && category.description!.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        category.description!,
                        style: AppTextStyles.bodyMuted,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        _buildChip('#${category.displayOrder}', AppColors.surfaceAlt, AppColors.textMuted),
                        const SizedBox(width: 8),
                        _buildChip(
                          category.isActive ? 'Hoạt động' : 'Tắt',
                          category.isActive
                              ? AppColors.success.withOpacity(0.15)
                              : AppColors.surfaceAlt,
                          category.isActive ? AppColors.success : AppColors.textMuted,
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
                  if (value == 'delete') onDelete();
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(value: 'edit', child: Row(
                    children: [
                      Icon(Icons.edit_outlined, size: 20),
                      SizedBox(width: 8),
                      Text('Sửa'),
                    ],
                  )),
                  PopupMenuItem(value: 'delete', child: Row(
                    children: [
                      Icon(Icons.delete_outline, size: 20, color: AppColors.error),
                      const SizedBox(width: 8),
                      Text('Xóa', style: TextStyle(color: AppColors.error)),
                    ],
                  )),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String label, Color bg, Color text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(label, style: TextStyle(fontSize: 11, color: text, fontWeight: FontWeight.w500)),
    );
  }
}
