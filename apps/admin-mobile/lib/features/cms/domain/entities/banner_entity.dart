import 'package:equatable/equatable.dart';

class BannerEntity extends Equatable {
  final String id;
  final String type; // promo | menu
  final String title;
  final String? subtitle;
  final String? description;
  final String? imageUrl;
  final String? ctaLabel;
  final String? ctaLink;
  final String? badge;
  final String? price;
  final String? alt;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BannerEntity({
    required this.id,
    required this.type,
    required this.title,
    this.subtitle,
    this.description,
    this.imageUrl,
    this.ctaLabel,
    this.ctaLink,
    this.badge,
    this.price,
    this.alt,
    this.isActive = true,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, type, title, subtitle, description, imageUrl,
        ctaLabel, ctaLink, badge, price, alt, isActive,
        createdAt, updatedAt,
      ];
}
