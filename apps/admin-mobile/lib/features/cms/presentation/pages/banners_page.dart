import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/data/upload_service.dart';
import '../../data/cms_repository.dart';
import '../bloc/banner_bloc.dart';
import '../../domain/entities/banner_entity.dart';
import '../../../shared/widgets/common_widgets.dart';

class BannersPage extends StatelessWidget {
  const BannersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => BannerBloc(context.read<CmsRepository>())
        ..add(BannerLoadRequested()),
      child: const _BannersView(),
    );
  }
}

class _BannersView extends StatelessWidget {
  const _BannersView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Banners'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showBannerForm(context, null),
          ),
        ],
      ),
      body: BlocBuilder<BannerBloc, BannerState>(
        builder: (context, state) {
          if (state is BannerLoading) {
            return const LoadingShimmer();
          }
          if (state is BannerError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<BannerBloc>().add(BannerLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is BannerLoaded) {
            if (state.banners.isEmpty) {
              return EmptyState(
                icon: Icons.image_outlined,
                title: 'Chưa có banner',
                subtitle: 'Tạo banner đầu tiên',
                action: ElevatedButton.icon(
                  onPressed: () => _showBannerForm(context, null),
                  icon: const Icon(Icons.add),
                  label: const Text('Tạo banner'),
                ),
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<BannerBloc>().add(BannerLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.banners.length,
                itemBuilder: (context, index) {
                  final banner = state.banners[index];
                  return _BannerCard(
                    banner: banner,
                    onEdit: () => _showBannerForm(context, banner),
                    onDelete: () => _confirmDelete(context, banner),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showBannerForm(context, null),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showBannerForm(BuildContext context, BannerEntity? banner) {
    final isEdit = banner != null;
    final titleController = TextEditingController(text: banner?.title ?? '');
    final subtitleController = TextEditingController(text: banner?.subtitle ?? '');
    final descController = TextEditingController(text: banner?.description ?? '');
    final ctaLabelController = TextEditingController(text: banner?.ctaLabel ?? '');
    final ctaLinkController = TextEditingController(text: banner?.ctaLink ?? '');
    String selectedType = banner?.type ?? 'promo';
    String? imageUrl = banner?.imageUrl;
    bool isActive = banner?.isActive ?? true;
    bool isUploading = false;

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
                          Text(isEdit ? 'Sửa banner' : 'Tạo banner',
                              style: AppTextStyles.title),
                          IconButton(
                            onPressed: () => Navigator.pop(ctx),
                            icon: const Icon(Icons.close),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _ImagePicker(
                        imageUrl: imageUrl,
                        isUploading: isUploading,
                        onPick: () async {
                          final picker = ImagePicker();
                          final img = await picker.pickImage(
                            source: ImageSource.gallery,
                            maxWidth: 1920,
                            maxHeight: 600,
                            imageQuality: 85,
                          );
                          if (img == null) return;
                          setState(() => isUploading = true);
                          try {
                            final uploadService = UploadService();
                            final result = await uploadService.uploadImage(
                              filePath: img.path,
                              folder: 'banners',
                              fileName: img.name,
                            );
                            setState(() {
                              imageUrl = result.secureUrl;
                              isUploading = false;
                            });
                          } catch (e) {
                            setState(() => isUploading = false);
                            if (ctx.mounted) {
                              ScaffoldMessenger.of(ctx).showSnackBar(
                                SnackBar(content: Text('Upload thất bại: $e')),
                              );
                            }
                          }
                        },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: selectedType,
                        decoration: const InputDecoration(labelText: 'Loại'),
                        items: const [
                          DropdownMenuItem(value: 'promo', child: Text('Khuyến mãi')),
                          DropdownMenuItem(value: 'menu', child: Text('Thực đơn')),
                        ],
                        onChanged: (v) => setState(() => selectedType = v!),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: titleController,
                        decoration: const InputDecoration(labelText: 'Tiêu đề'),
                        textCapitalization: TextCapitalization.words,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: subtitleController,
                        decoration: const InputDecoration(labelText: 'Phụ đề (tùy chọn)'),
                        textCapitalization: TextCapitalization.sentences,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: descController,
                        decoration: const InputDecoration(labelText: 'Mô tả (tùy chọn)'),
                        maxLines: 2,
                        textCapitalization: TextCapitalization.sentences,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: ctaLabelController,
                              decoration: const InputDecoration(labelText: 'Nút (VD: Đặt hàng)'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: ctaLinkController,
                              decoration: const InputDecoration(labelText: 'Link đích'),
                            ),
                          ),
                        ],
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
                        onPressed: isUploading
                            ? null
                            : () {
                                if (titleController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Tiêu đề không được trống')),
                                  );
                                  return;
                                }
                                final input = <String, dynamic>{
                                  'type': selectedType,
                                  'title': titleController.text.trim(),
                                  'subtitle': subtitleController.text.trim(),
                                  'description': descController.text.trim(),
                                  'imageUrl': imageUrl,
                                  'ctaLabel': ctaLabelController.text.trim(),
                                  'ctaLink': ctaLinkController.text.trim(),
                                  'isActive': isActive,
                                };
                                if (isEdit) {
                                  context.read<BannerBloc>().add(BannerUpdated(banner.id, input));
                                } else {
                                  context.read<BannerBloc>().add(BannerCreated(input));
                                }
                                Navigator.pop(ctx);
                              },
                        child: Text(isEdit ? 'Lưu thay đổi' : 'Tạo banner'),
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

  void _confirmDelete(BuildContext context, BannerEntity banner) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa banner'),
        content: Text('Xóa "${banner.title}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Hủy')),
          TextButton(
            onPressed: () {
              context.read<BannerBloc>().add(BannerDeleted(banner.id));
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

class _ImagePicker extends StatelessWidget {
  final String? imageUrl;
  final bool isUploading;
  final VoidCallback onPick;

  const _ImagePicker({
    required this.imageUrl,
    required this.isUploading,
    required this.onPick,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isUploading ? null : onPick,
      child: Container(
        height: 160,
        decoration: BoxDecoration(
          color: AppColors.surfaceAlt,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
          image: imageUrl != null
              ? DecorationImage(
                  image: NetworkImage(imageUrl!),
                  fit: BoxFit.cover,
                )
              : null,
        ),
        child: isUploading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: AppColors.primary),
                    SizedBox(height: 8),
                    Text('Đang tải lên...',
                        style: TextStyle(color: AppColors.textMuted)),
                  ],
                ),
              )
            : imageUrl == null
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.add_photo_alternate,
                          size: 40, color: AppColors.textMuted),
                      const SizedBox(height: 8),
                      Text('Nhấn để chọn ảnh',
                          style: AppTextStyles.bodyMuted),
                    ],
                  )
                : Align(
                    alignment: Alignment.topRight,
                    child: Container(
                      margin: const EdgeInsets.all(8),
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.edit, color: Colors.white, size: 18),
                    ),
                  ),
      ),
    );
  }
}

class _BannerCard extends StatelessWidget {
  final BannerEntity banner;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _BannerCard({
    required this.banner,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onEdit,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (banner.imageUrl != null)
              Container(
                height: 140,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  image: DecorationImage(
                    image: NetworkImage(banner.imageUrl!),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                height: 100,
                width: double.infinity,
                color: AppColors.surfaceAlt,
                child: const Icon(Icons.image, color: AppColors.textMuted, size: 40),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: banner.type == 'promo'
                              ? Colors.purple.withOpacity(0.1)
                              : AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          banner.type == 'promo' ? 'Khuyến mãi' : 'Thực đơn',
                          style: TextStyle(
                            color: banner.type == 'promo' ? Colors.purple : AppColors.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: banner.isActive
                              ? AppColors.success.withOpacity(0.1)
                              : AppColors.surfaceAlt,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          banner.isActive ? 'Hoạt động' : 'Tắt',
                          style: TextStyle(
                            fontSize: 11,
                            color: banner.isActive ? AppColors.success : AppColors.textMuted,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(banner.title, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
                  if (banner.subtitle != null && banner.subtitle!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(banner.subtitle!, style: AppTextStyles.bodyMuted, maxLines: 1),
                  ],
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
          ],
        ),
      ),
    );
  }
}
