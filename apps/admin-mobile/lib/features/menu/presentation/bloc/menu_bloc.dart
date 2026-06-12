import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/menu_entities.dart';
import '../../data/menu_repository.dart';

part 'menu_event.dart';
part 'menu_state.dart';

class MenuBloc extends Bloc<MenuEvent, MenuState> {
  final MenuRepository _repository;

  MenuBloc(this._repository) : super(MenuInitial()) {
    on<MenuLoadRequested>(_onLoadRequested);
    on<MenuCategoryCreated>(_onCategoryCreated);
    on<MenuCategoryUpdated>(_onCategoryUpdated);
    on<MenuCategoryDeleted>(_onCategoryDeleted);
    on<MenuItemCreated>(_onItemCreated);
    on<MenuItemUpdated>(_onItemUpdated);
    on<MenuItemDeleted>(_onItemDeleted);
  }

  Future<void> _onLoadRequested(
    MenuLoadRequested event,
    Emitter<MenuState> emit,
  ) async {
    emit(MenuLoading());
    try {
      final results = await Future.wait([
        _repository.getCategories(),
        _repository.getItems(),
      ]);
      emit(MenuLoaded(
        categories: results[0] as List<MenuCategory>,
        items: results[1] as List<MenuItem>,
      ));
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onCategoryCreated(
    MenuCategoryCreated event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.createCategory(event.input);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onCategoryUpdated(
    MenuCategoryUpdated event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.updateCategory(event.id, event.input);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onCategoryDeleted(
    MenuCategoryDeleted event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.deleteCategory(event.id);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onItemCreated(
    MenuItemCreated event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.createItem(event.input);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onItemUpdated(
    MenuItemUpdated event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.updateItem(event.id, event.input);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }

  Future<void> _onItemDeleted(
    MenuItemDeleted event,
    Emitter<MenuState> emit,
  ) async {
    try {
      await _repository.deleteItem(event.id);
      add(MenuLoadRequested());
    } catch (e) {
      emit(MenuError(e.toString()));
    }
  }
}
