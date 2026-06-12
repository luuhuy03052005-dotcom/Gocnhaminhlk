import 'package:equatable/equatable.dart';

class MenuCategory extends Equatable {
  final String id;
  final String name;
  final String? slug;
  final String? description;
  final int displayOrder;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MenuCategory({
    required this.id,
    required this.name,
    this.slug,
    this.description,
    required this.displayOrder,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props =>
      [id, name, slug, description, displayOrder, isActive, createdAt, updatedAt];
}

class MenuItem extends Equatable {
  final String id;
  final String categoryId;
  final String name;
  final String? slug;
  final int price;
  final String? description;
  final String? imageUrl;
  final bool isAvailable;
  final bool isBestSeller;
  final int displayOrder;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MenuItem({
    required this.id,
    required this.categoryId,
    required this.name,
    this.slug,
    required this.price,
    this.description,
    this.imageUrl,
    required this.isAvailable,
    this.isBestSeller = false,
    required this.displayOrder,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, categoryId, name, slug, price, description,
        imageUrl, isAvailable, isBestSeller, displayOrder,
        createdAt, updatedAt,
      ];
}
