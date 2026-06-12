part of 'banner_bloc.dart';

abstract class BannerEvent extends Equatable {
  const BannerEvent();

  @override
  List<Object?> get props => [];
}

class BannerLoadRequested extends BannerEvent {}

class BannerCreated extends BannerEvent {
  final Map<String, dynamic> input;
  const BannerCreated(this.input);

  @override
  List<Object?> get props => [input];
}

class BannerUpdated extends BannerEvent {
  final String id;
  final Map<String, dynamic> input;
  const BannerUpdated(this.id, this.input);

  @override
  List<Object?> get props => [id, input];
}

class BannerDeleted extends BannerEvent {
  final String id;
  const BannerDeleted(this.id);

  @override
  List<Object?> get props => [id];
}
