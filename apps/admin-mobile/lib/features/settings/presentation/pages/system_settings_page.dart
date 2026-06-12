import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/settings_repository.dart';
import '../bloc/settings_bloc.dart';
import '../../../shared/widgets/common_widgets.dart';

class SystemSettingsPage extends StatelessWidget {
  const SystemSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => SystemSettingBloc(context.read<SettingsRepository>())
        ..add(SystemSettingLoadRequested()),
      child: const _SystemSettingsView(),
    );
  }
}

class _SystemSettingsView extends StatelessWidget {
  const _SystemSettingsView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('System Settings'),
        automaticallyImplyLeading: false,
      ),
      body: BlocBuilder<SystemSettingBloc, SystemSettingState>(
        builder: (context, state) {
          if (state is SystemSettingLoading) {
            return const LoadingShimmer();
          }
          if (state is SystemSettingError) {
            return EmptyState(
              icon: Icons.error_outline,
              title: 'Lỗi tải dữ liệu',
              subtitle: state.message,
              action: ElevatedButton(
                onPressed: () =>
                    context.read<SystemSettingBloc>().add(SystemSettingLoadRequested()),
                child: const Text('Thử lại'),
              ),
            );
          }
          if (state is SystemSettingLoaded) {
            if (state.settings.isEmpty) {
              return const EmptyState(
                icon: Icons.settings_outlined,
                title: 'Không có cài đặt',
                subtitle: 'Danh sách trống',
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<SystemSettingBloc>().add(SystemSettingLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.settings.length,
                itemBuilder: (context, index) {
                  final setting = state.settings[index];
                  return _SettingCard(
                    setting: setting,
                    onSave: (key, input) {
                      context.read<SystemSettingBloc>().add(
                        SystemSettingUpdated(key, input),
                      );
                    },
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

class _SettingCard extends StatefulWidget {
  final dynamic setting;
  final void Function(String key, Map<String, dynamic> input) onSave;

  const _SettingCard({
    required this.setting,
    required this.onSave,
  });

  @override
  State<_SettingCard> createState() => _SettingCardState();
}

class _SettingCardState extends State<_SettingCard> {
  late Map<String, dynamic> _value;
  bool _editing = false;

  @override
  void initState() {
    super.initState();
    _value = Map<String, dynamic>.from(widget.setting.value as Map? ?? {});
  }

  @override
  void didUpdateWidget(_SettingCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.setting.value != widget.setting.value) {
      _value = Map<String, dynamic>.from(widget.setting.value as Map? ?? {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.setting.key,
                        style: AppTextStyles.title,
                      ),
                      if (widget.setting.description != null &&
                          widget.setting.description.toString().isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          widget.setting.description.toString(),
                          style: AppTextStyles.bodyMuted,
                        ),
                      ],
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(_editing ? Icons.close : Icons.edit, color: AppColors.primary),
                  onPressed: () => setState(() => _editing = !_editing),
                ),
              ],
            ),
            if (_editing) ...[
              const SizedBox(height: 16),
              _buildFields(),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    widget.onSave(widget.setting.key, {
                      'value': _value,
                      'description': widget.setting.description,
                    });
                    setState(() => _editing = false);
                  },
                  child: const Text('Lưu thay đổi'),
                ),
              ),
            ] else ...[
              const SizedBox(height: 12),
              _buildReadOnlyView(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildFields() {
    final key = widget.setting.key as String;

    if (key == 'commerce') {
      return Column(
        children: [
          SwitchListTile(
            title: const Text('Mở cửa'),
            value: _value['shopOpen'] as bool? ?? false,
            onChanged: (v) => setState(() => _value['shopOpen'] = v),
            activeColor: AppColors.primary,
            contentPadding: EdgeInsets.zero,
          ),
          SwitchListTile(
            title: const Text('Cho phép đặt hàng'),
            value: _value['allowOrdering'] as bool? ?? false,
            onChanged: (v) => setState(() => _value['allowOrdering'] = v),
            activeColor: AppColors.primary,
            contentPadding: EdgeInsets.zero,
          ),
          SwitchListTile(
            title: const Text('Cho phép nhận voucher'),
            value: _value['allowVoucherClaim'] as bool? ?? false,
            onChanged: (v) => setState(() => _value['allowVoucherClaim'] = v),
            activeColor: AppColors.primary,
            contentPadding: EdgeInsets.zero,
          ),
          const SizedBox(height: 8),
          TextField(
            controller: TextEditingController(
              text: (_value['deliveryRadiusKm'] as num?)?.toString() ?? '',
            ),
            decoration: const InputDecoration(labelText: 'Bán kính giao hàng (km)'),
            keyboardType: TextInputType.number,
            onChanged: (v) => _value['deliveryRadiusKm'] = num.tryParse(v),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: TextEditingController(
              text: (_value['minimumOrderAmount'] as num?)?.toString() ?? '',
            ),
            decoration: const InputDecoration(labelText: 'Đơn hàng tối thiểu (VNĐ)'),
            keyboardType: TextInputType.number,
            onChanged: (v) => _value['minimumOrderAmount'] = num.tryParse(v),
          ),
        ],
      );
    }

    return Text(
      _value.toString(),
      style: AppTextStyles.bodyMuted,
    );
  }

  Widget _buildReadOnlyView() {
    final key = widget.setting.key as String;

    if (key == 'commerce') {
      return Column(
        children: [
          _buildRow('Mở cửa', (_value['shopOpen'] as bool? ?? false) ? 'Có' : 'Không'),
          _buildRow('Cho phép đặt hàng', (_value['allowOrdering'] as bool? ?? false) ? 'Có' : 'Không'),
          _buildRow('Nhận voucher', (_value['allowVoucherClaim'] as bool? ?? false) ? 'Có' : 'Không'),
          _buildRow('Bán kính giao hàng', '${_value['deliveryRadiusKm'] ?? '—'} km'),
          _buildRow(
            'Đơn tối thiểu',
            _value['minimumOrderAmount'] != null
                ? '${_value['minimumOrderAmount']}đ'
                : '—',
          ),
        ],
      );
    }

    return Text(
      widget.setting.value?.toString() ?? '—',
      style: AppTextStyles.body,
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTextStyles.bodyMuted),
          Text(value, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
