import 'package:equatable/equatable.dart';

class GalleryImage extends Equatable {
  final String id;
  final String title;
  final String? subtitle;
  final String? description;
  final String? imageUrl;
  final String? ctaLabel;
  final String? ctaLink;
  final String? badge;
  final String? objectPosition;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const GalleryImage({
    required this.id,
    required this.title,
    this.subtitle,
    this.description,
    this.imageUrl,
    this.ctaLabel,
    this.ctaLink,
    this.badge,
    this.objectPosition,
    this.isActive = true,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id, title, subtitle, description, imageUrl,
        ctaLabel, ctaLink, badge, objectPosition, isActive,
        createdAt, updatedAt,
      ];
}
