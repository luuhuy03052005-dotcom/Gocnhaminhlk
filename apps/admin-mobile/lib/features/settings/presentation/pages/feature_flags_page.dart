import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/settings_repository.dart';
import '../bloc/settings_bloc.dart';
import '../../../shared/widgets/common_widgets.dart';

class FeatureFlagsPage extends StatelessWidget {
  const FeatureFlagsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => FeatureFlagBloc(context.read<SettingsRepository>())
        ..add(FeatureFlagLoadRequested()),
      child: const _FeatureFlagsView(),
    );
  }
}

class _FeatureFlagsView extends StatelessWidget {
  const _FeatureFlagsView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feature Flags'),
        automaticallyImplyLeading: false,
      ),
      body: BlocBuilder<FeatureFlagBloc, FeatureFlagState>(
        builder: (context, state) {
          if (state is FeatureFlagLoading) {
            return const LoadingShimmer();
          }
          if (state is FeatureFlagError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<FeatureFlagBloc>().add(FeatureFlagLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is FeatureFlagLoaded) {
            if (state.flags.isEmpty) {
              return const EmptyState(
                icon: Icons.flag_outlined,
                title: 'Không có feature flag',
                subtitle: 'Danh sách trống',
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<FeatureFlagBloc>().add(FeatureFlagLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.flags.length,
                itemBuilder: (context, index) {
                  final flag = state.flags[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: SwitchListTile(
                      title: Text(flag.key, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
                      subtitle: Text(
                        flag.description.isNotEmpty
                            ? flag.description
                            : 'Không có mô tả',
                        style: AppTextStyles.bodyMuted,
                        maxLines: 2,
                      ),
                      value: flag.enabled,
                      onChanged: (value) {
                        context.read<FeatureFlagBloc>().add(
                          FeatureFlagToggled(flag.key, value),
                        );
                      },
                      activeColor: AppColors.primary,
                    ),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
