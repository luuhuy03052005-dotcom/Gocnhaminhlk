import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/data/upload_service.dart';
import '../../data/cms_repository.dart';
import '../bloc/gallery_bloc.dart';
import '../../domain/entities/gallery_entity.dart';
import '../../../shared/widgets/common_widgets.dart';

class GalleryPage extends StatelessWidget {
  const GalleryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GalleryBloc(context.read<CmsRepository>())
        ..add(GalleryLoadRequested()),
      child: const _GalleryView(),
    );
  }
}

class _GalleryView extends StatelessWidget {
  const _GalleryView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gallery'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showGalleryForm(context, null),
          ),
        ],
      ),
      body: BlocBuilder<GalleryBloc, GalleryState>(
        builder: (context, state) {
          if (state is GalleryLoading) {
            return const LoadingShimmer();
          }
          if (state is GalleryError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<GalleryBloc>().add(GalleryLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is GalleryLoaded) {
            if (state.images.isEmpty) {
              return EmptyState(
                icon: Icons.photo_library_outlined,
                title: 'Chưa có ảnh',
                subtitle: 'Thêm ảnh vào thư viện',
                action: ElevatedButton.icon(
                  onPressed: () => _showGalleryForm(context, null),
                  icon: const Icon(Icons.add),
                  label: const Text('Thêm ảnh'),
                ),
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<GalleryBloc>().add(GalleryLoadRequested());
              },
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1,
                ),
                itemCount: state.images.length,
                itemBuilder: (context, index) {
                  final img = state.images[index];
                  return _GalleryCard(
                    image: img,
                    onEdit: () => _showGalleryForm(context, img),
                    onDelete: () => _confirmDelete(context, img),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showGalleryForm(context, null),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showGalleryForm(BuildContext context, GalleryImage? image) {
    final isEdit = image != null;
    final titleController = TextEditingController(text: image?.title ?? '');
    final subtitleController = TextEditingController(text: image?.subtitle ?? '');
    final descController = TextEditingController(text: image?.description ?? '');
    String? imageUrl = image?.imageUrl;
    bool isActive = image?.isActive ?? true;
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
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(isEdit ? 'Sửa ảnh' : 'Thêm ảnh',
                            style: AppTextStyles.title),
                        IconButton(
                          onPressed: () => Navigator.pop(ctx),
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: isUploading
                          ? null
                          : () async {
                              final picker = ImagePicker();
                              final img = await picker.pickImage(
                                source: ImageSource.gallery,
                                maxWidth: 1200,
                                maxHeight: 1200,
                                imageQuality: 85,
                              );
                              if (img == null) return;
                              setState(() => isUploading = true);
                              try {
                                final result = await UploadService().uploadImage(
                                  filePath: img.path,
                                  folder: 'gallery',
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
                                      Text('Chọn ảnh',
                                          style: AppTextStyles.bodyMuted),
                                    ],
                                  )
                                : null,
                      ),
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
                                'title': titleController.text.trim(),
                                'subtitle': subtitleController.text.trim(),
                                'description': descController.text.trim(),
                                'imageUrl': imageUrl,
                                'isActive': isActive,
                              };
                              if (isEdit) {
                                context.read<GalleryBloc>().add(GalleryUpdated(image.id, input));
                              } else {
                                context.read<GalleryBloc>().add(GalleryCreated(input));
                              }
                              Navigator.pop(ctx);
                            },
                      child: Text(isEdit ? 'Lưu thay đổi' : 'Thêm ảnh'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _confirmDelete(BuildContext context, GalleryImage image) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa ảnh'),
        content: Text('Xóa "${image.title}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Hủy')),
          TextButton(
            onPressed: () {
              context.read<GalleryBloc>().add(GalleryDeleted(image.id));
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

class _GalleryCard extends StatelessWidget {
  final GalleryImage image;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _GalleryCard({
    required this.image,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onEdit,
        child: Stack(
          children: [
            Positioned.fill(
              child: image.imageUrl != null
                  ? Image.network(
                      image.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: AppColors.surfaceAlt,
                        child: const Icon(Icons.broken_image, color: AppColors.textMuted),
                      ),
                    )
                  : Container(
                      color: AppColors.surfaceAlt,
                      child: const Icon(Icons.photo, color: AppColors.textMuted),
                    ),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withOpacity(0.7),
                      Colors.transparent,
                    ],
                  ),
                ),
                child: Text(
                  image.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
            Positioned(
              top: 4,
              right: 4,
              child: PopupMenuButton<String>(
                icon: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.black45,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Icon(Icons.more_vert, color: Colors.white, size: 18),
                ),
                onSelected: (v) {
                  if (v == 'edit') onEdit();
                  if (v == 'delete') onDelete();
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit_outlined, size: 20),
                        SizedBox(width: 8),
                        Text('Sửa'),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete_outline, size: 20, color: AppColors.error),
                        const SizedBox(width: 8),
                        Text('Xóa', style: TextStyle(color: AppColors.error)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (!image.isActive)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.4),
                  child: const Center(
                    child: Text(
                      'TẮT',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
