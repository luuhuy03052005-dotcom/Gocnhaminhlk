part of 'gallery_bloc.dart';

abstract class GalleryEvent extends Equatable {
  const GalleryEvent();

  @override
  List<Object?> get props => [];
}

class GalleryLoadRequested extends GalleryEvent {}

class GalleryCreated extends GalleryEvent {
  final Map<String, dynamic> input;
  const GalleryCreated(this.input);

  @override
  List<Object?> get props => [input];
}

class GalleryUpdated extends GalleryEvent {
  final String id;
  final Map<String, dynamic> input;
  const GalleryUpdated(this.id, this.input);

  @override
  List<Object?> get props => [id, input];
}

class GalleryDeleted extends GalleryEvent {
  final String id;
  const GalleryDeleted(this.id);

  @override
  List<Object?> get props => [id];
}
