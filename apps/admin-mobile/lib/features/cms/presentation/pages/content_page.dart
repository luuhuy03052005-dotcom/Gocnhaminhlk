import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/data/api_service.dart';
import '../../../shared/widgets/common_widgets.dart';

class ContentPage extends StatefulWidget {
  const ContentPage({super.key});

  @override
  State<ContentPage> createState() => _ContentPageState();
}

class _ContentPageState extends State<ContentPage> {
  Map<String, dynamic>? _content;
  bool _loading = true;
  String? _error;
  final _api = ApiService();

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.get('/admin/website-content');
      setState(() {
        _content = res.data['data'] as Map<String, dynamic>?;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Website Content'),
        automaticallyImplyLeading: false,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingShimmer();

    if (_error != null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Lỗi tải dữ liệu',
        subtitle: _error,
        action: ElevatedButton(
          onPressed: _loadContent,
          child: const Text('Thử lại'),
        ),
      );
    }

    final sections = <_SectionDef>[
      _SectionDef(
        key: 'about',
        title: 'Giới thiệu',
        icon: Icons.info_outline,
        fields: [
          _FieldDef(key: 'shopName', label: 'Tên cửa hàng', multiline: true),
          _FieldDef(key: 'tagline', label: 'Tagline', multiline: false),
          _FieldDef(key: 'description', label: 'Mô tả', multiline: true),
          _FieldDef(key: 'address', label: 'Địa chỉ', multiline: true),
          _FieldDef(key: 'phone', label: 'Số điện thoại', multiline: false),
          _FieldDef(key: 'email', label: 'Email', multiline: false),
          _FieldDef(key: 'openingHours', label: 'Giờ mở cửa', multiline: false),
        ],
      ),
      _SectionDef(
        key: 'social',
        title: 'Mạng xã hội',
        icon: Icons.link,
        fields: [
          _FieldDef(key: 'facebook', label: 'Facebook URL', multiline: false),
          _FieldDef(key: 'instagram', label: 'Instagram URL', multiline: false),
          _FieldDef(key: 'zalo', label: 'Zalo URL', multiline: false),
        ],
      ),
    ];

    return RefreshIndicator(
      onRefresh: _loadContent,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ...sections.map((section) => _buildSection(section)),
        ],
      ),
    );
  }

  Widget _buildSection(_SectionDef section) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(section.icon, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(section.title, style: AppTextStyles.title),
              ],
            ),
            const Divider(height: 24),
            ...section.fields.map((field) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildField(field),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildField(_FieldDef field) {
    final sectionData = _content?[field.key] as Map<String, dynamic>? ?? {};
    final value = sectionData['value']?.toString() ?? '';
    final isActive = sectionData['isActive'] as bool? ?? true;
    final controller = TextEditingController(text: value);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(child: Text(field.label, style: AppTextStyles.body)),
            Switch(
              value: isActive,
              onChanged: (v) => _toggleField(field.key, value, v),
              activeColor: AppColors.primary,
            ),
          ],
        ),
        if (field.multiline)
          TextField(
            controller: controller,
            decoration: InputDecoration(
              hintText: 'Nhập ${field.label.toLowerCase()}...',
            ),
            maxLines: 3,
            onSubmitted: (v) => _saveField(field.key, v, isActive),
          )
        else
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    hintText: 'Nhập ${field.label.toLowerCase()}...',
                  ),
                  onSubmitted: (v) => _saveField(field.key, v, isActive),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.save, color: AppColors.primary),
                onPressed: () => _saveField(field.key, controller.text, isActive),
              ),
            ],
          ),
      ],
    );
  }

  Future<void> _saveField(String key, String value, bool isActive) async {
    try {
      await _api.patch('/admin/website-content/$key', data: {
        'value': value,
        'isActive': isActive,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đã lưu'),
            backgroundColor: AppColors.success,
          ),
        );
      }
      _loadContent();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  Future<void> _toggleField(String key, String value, bool isActive) async {
    await _saveField(key, value, isActive);
  }
}

class _SectionDef {
  final String key;
  final String title;
  final IconData icon;
  final List<_FieldDef> fields;

  const _SectionDef({
    required this.key,
    required this.title,
    required this.icon,
    required this.fields,
  });
}

class _FieldDef {
  final String key;
  final String label;
  final bool multiline;

  const _FieldDef({
    required this.key,
    required this.label,
    this.multiline = false,
  });
}
