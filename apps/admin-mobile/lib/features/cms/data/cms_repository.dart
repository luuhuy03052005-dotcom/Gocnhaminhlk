import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/cms/domain/entities/banner_entity.dart';
import 'package:goc_nha_minh_admin/features/cms/domain/entities/gallery_entity.dart';

class CmsRepository {
  final ApiService _api;

  CmsRepository(this._api);

  // --- Banners ---
  Future<List<BannerEntity>> getBanners() async {
    final res = await _api.get('/admin/banners');
    final data = res.data['data'] as List;
    return data.map((e) => _parseBanner(e as Map<String, dynamic>)).toList();
  }

  Future<BannerEntity> createBanner(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/banners', data: input);
    return _parseBanner(res.data['data'] as Map<String, dynamic>);
  }

  Future<BannerEntity> updateBanner(String id, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/banners/$id', data: input);
    return _parseBanner(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> deleteBanner(String id) async {
    await _api.delete('/admin/banners/$id');
  }

  // --- Gallery ---
  Future<List<GalleryImage>> getGallery() async {
    final res = await _api.get('/admin/gallery');
    final data = res.data['data'] as List;
    return data.map((e) => _parseGallery(e as Map<String, dynamic>)).toList();
  }

  Future<GalleryImage> createGallery(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/gallery', data: input);
    return _parseGallery(res.data['data'] as Map<String, dynamic>);
  }

  Future<GalleryImage> updateGallery(String id, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/gallery/$id', data: input);
    return _parseGallery(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> deleteGallery(String id) async {
    await _api.delete('/admin/gallery/$id');
  }

  // --- Website Content ---
  Future<Map<String, dynamic>> getWebsiteContent() async {
    final res = await _api.get('/admin/website-content');
    return res.data['data'] as Map<String, dynamic>;
  }

  Future<void> updateWebsiteContent(String key, Map<String, dynamic> input) async {
    await _api.patch('/admin/website-content/$key', data: input);
  }

  BannerEntity _parseBanner(Map<String, dynamic> e) {
    return BannerEntity(
      id: e['id'] as String,
      type: e['type'] as String,
      title: e['title'] as String,
      subtitle: e['subtitle'] as String?,
      description: e['description'] as String?,
      imageUrl: e['imageUrl'] as String?,
      ctaLabel: e['ctaLabel'] as String?,
      ctaLink: e['ctaLink'] as String?,
      badge: e['badge'] as String?,
      price: e['price'] as String?,
      alt: e['alt'] as String?,
      isActive: e['isActive'] as bool? ?? true,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }

  GalleryImage _parseGallery(Map<String, dynamic> e) {
    return GalleryImage(
      id: e['id'] as String,
      title: e['title'] as String,
      subtitle: e['subtitle'] as String?,
      description: e['description'] as String?,
      imageUrl: e['imageUrl'] as String?,
      ctaLabel: e['ctaLabel'] as String?,
      ctaLink: e['ctaLink'] as String?,
      badge: e['badge'] as String?,
      objectPosition: e['objectPosition'] as String?,
      isActive: e['isActive'] as bool? ?? true,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }
}
