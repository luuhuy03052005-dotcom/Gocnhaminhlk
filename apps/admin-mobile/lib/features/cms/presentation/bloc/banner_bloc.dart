import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/cms_repository.dart';
import '../../../../features/cms/domain/entities/banner_entity.dart';

part 'banner_event.dart';
part 'banner_state.dart';

class BannerBloc extends Bloc<BannerEvent, BannerState> {
  final CmsRepository _repository;

  BannerBloc(this._repository) : super(BannerInitial()) {
    on<BannerLoadRequested>(_onLoadRequested);
    on<BannerCreated>(_onCreated);
    on<BannerUpdated>(_onUpdated);
    on<BannerDeleted>(_onDeleted);
  }

  Future<void> _onLoadRequested(
    BannerLoadRequested event,
    Emitter<BannerState> emit,
  ) async {
    emit(BannerLoading());
    try {
      final banners = await _repository.getBanners();
      emit(BannerLoaded(banners));
    } catch (e) {
      emit(BannerError(e.toString()));
    }
  }

  Future<void> _onCreated(
    BannerCreated event,
    Emitter<BannerState> emit,
  ) async {
    try {
      await _repository.createBanner(event.input);
      add(BannerLoadRequested());
    } catch (e) {
      emit(BannerError(e.toString()));
    }
  }

  Future<void> _onUpdated(
    BannerUpdated event,
    Emitter<BannerState> emit,
  ) async {
    try {
      await _repository.updateBanner(event.id, event.input);
      add(BannerLoadRequested());
    } catch (e) {
      emit(BannerError(e.toString()));
    }
  }

  Future<void> _onDeleted(
    BannerDeleted event,
    Emitter<BannerState> emit,
  ) async {
    try {
      await _repository.deleteBanner(event.id);
      add(BannerLoadRequested());
    } catch (e) {
      emit(BannerError(e.toString()));
    }
  }
}
