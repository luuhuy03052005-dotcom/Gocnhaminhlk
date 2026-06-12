import 'package:goc_nha_minh_admin/core/data/api_service.dart';
import 'package:goc_nha_minh_admin/features/menu/domain/entities/menu_entities.dart';

class MenuRepository {
  final ApiService _api;

  MenuRepository(this._api);

  Future<List<MenuCategory>> getCategories() async {
    final res = await _api.get('/admin/menu/categories');
    final data = res.data['data'] as List;
    return data.map((e) => _parseCategory(e as Map<String, dynamic>)).toList();
  }

  Future<MenuCategory> createCategory(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/menu/categories', data: input);
    return _parseCategory(res.data['data'] as Map<String, dynamic>);
  }

  Future<MenuCategory> updateCategory(String id, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/menu/categories/$id', data: input);
    return _parseCategory(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> deleteCategory(String id) async {
    await _api.delete('/admin/menu/categories/$id');
  }

  Future<List<MenuItem>> getItems() async {
    final res = await _api.get('/admin/menu/items');
    final data = res.data['data'] as List;
    return data.map((e) => _parseItem(e as Map<String, dynamic>)).toList();
  }

  Future<MenuItem> createItem(Map<String, dynamic> input) async {
    final res = await _api.post('/admin/menu/items', data: input);
    return _parseItem(res.data['data'] as Map<String, dynamic>);
  }

  Future<MenuItem> updateItem(String id, Map<String, dynamic> input) async {
    final res = await _api.patch('/admin/menu/items/$id', data: input);
    return _parseItem(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> deleteItem(String id) async {
    await _api.delete('/admin/menu/items/$id');
  }

  MenuCategory _parseCategory(Map<String, dynamic> e) {
    return MenuCategory(
      id: e['id'] as String,
      name: e['name'] as String,
      slug: e['slug'] as String?,
      description: e['description'] as String?,
      displayOrder: (e['displayOrder'] as num?)?.toInt() ?? 0,
      isActive: e['isActive'] as bool? ?? true,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }

  MenuItem _parseItem(Map<String, dynamic> e) {
    return MenuItem(
      id: e['id'] as String,
      categoryId: e['categoryId'] as String,
      name: e['name'] as String,
      slug: e['slug'] as String?,
      price: (e['price'] as num).toInt(),
      description: e['description'] as String?,
      imageUrl: e['imageUrl'] as String?,
      isAvailable: e['isAvailable'] as bool? ?? true,
      isBestSeller: e['isBestSeller'] as bool? ?? false,
      displayOrder: (e['displayOrder'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.parse(e['createdAt'] as String),
      updatedAt: DateTime.parse(e['updatedAt'] as String),
    );
  }
}
