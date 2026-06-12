import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/cms_repository.dart';
import '../../../../features/cms/domain/entities/gallery_entity.dart';

part 'gallery_event.dart';
part 'gallery_state.dart';

class GalleryBloc extends Bloc<GalleryEvent, GalleryState> {
  final CmsRepository _repository;

  GalleryBloc(this._repository) : super(GalleryInitial()) {
    on<GalleryLoadRequested>(_onLoadRequested);
    on<GalleryCreated>(_onCreated);
    on<GalleryUpdated>(_onUpdated);
    on<GalleryDeleted>(_onDeleted);
  }

  Future<void> _onLoadRequested(
    GalleryLoadRequested event,
    Emitter<GalleryState> emit,
  ) async {
    emit(GalleryLoading());
    try {
      final images = await _repository.getGallery();
      emit(GalleryLoaded(images));
    } catch (e) {
      emit(GalleryError(e.toString()));
    }
  }

  Future<void> _onCreated(
    GalleryCreated event,
    Emitter<GalleryState> emit,
  ) async {
    try {
      await _repository.createGallery(event.input);
      add(GalleryLoadRequested());
    } catch (e) {
      emit(GalleryError(e.toString()));
    }
  }

  Future<void> _onUpdated(
    GalleryUpdated event,
    Emitter<GalleryState> emit,
  ) async {
    try {
      await _repository.updateGallery(event.id, event.input);
      add(GalleryLoadRequested());
    } catch (e) {
      emit(GalleryError(e.toString()));
    }
  }

  Future<void> _onDeleted(
    GalleryDeleted event,
    Emitter<GalleryState> emit,
  ) async {
    try {
      await _repository.deleteGallery(event.id);
      add(GalleryLoadRequested());
    } catch (e) {
      emit(GalleryError(e.toString()));
    }
  }
}
