part of 'menu_bloc.dart';

abstract class MenuEvent extends Equatable {
  const MenuEvent();

  @override
  List<Object?> get props => [];
}

class MenuLoadRequested extends MenuEvent {}

class MenuCategoryCreated extends MenuEvent {
  final Map<String, dynamic> input;
  const MenuCategoryCreated(this.input);

  @override
  List<Object?> get props => [input];
}

class MenuCategoryUpdated extends MenuEvent {
  final String id;
  final Map<String, dynamic> input;
  const MenuCategoryUpdated(this.id, this.input);

  @override
  List<Object?> get props => [id, input];
}

class MenuCategoryDeleted extends MenuEvent {
  final String id;
  const MenuCategoryDeleted(this.id);

  @override
  List<Object?> get props => [id];
}

class MenuItemCreated extends MenuEvent {
  final Map<String, dynamic> input;
  const MenuItemCreated(this.input);

  @override
  List<Object?> get props => [input];
}

class MenuItemUpdated extends MenuEvent {
  final String id;
  final Map<String, dynamic> input;
  const MenuItemUpdated(this.id, this.input);

  @override
  List<Object?> get props => [id, input];
}

class MenuItemDeleted extends MenuEvent {
  final String id;
  const MenuItemDeleted(this.id);

  @override
  List<Object?> get props => [id];
}
