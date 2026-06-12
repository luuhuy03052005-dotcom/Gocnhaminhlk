import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../bloc/auth_bloc.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  int _countdown = 0;
  bool _showOtp = false;
  String _maskedPhone = '';

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _startCountdown() {
    _countdown = 60;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => _countdown--);
      return _countdown > 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthOtpPending) {
          setState(() {
            _showOtp = true;
            _maskedPhone = state.maskedPhone;
          });
          _startCountdown();
        } else if (state is AuthError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 48),
                _buildLogo(),
                const SizedBox(height: 48),
                _buildCard(),
                const SizedBox(height: 24),
                _buildFooter(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: AppColors.surfaceAlt,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border, width: 2),
          ),
          child: const Icon(
            Icons.coffee,
            size: 40,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Góc Nhà Mình',
          style: AppTextStyles.heading.copyWith(fontSize: 28),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          'Quản trị viên',
          style: AppTextStyles.bodyMuted,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildCard() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (!_showOtp) ...[
                Text('Đăng nhập', style: AppTextStyles.title),
                const SizedBox(height: 8),
                Text(
                  'Nhập số điện thoại để đăng nhập',
                  style: AppTextStyles.bodyMuted,
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Số điện thoại',
                    hintText: '088 988 8339',
                    prefixText: '+84 ',
                  ),
                ),
                const SizedBox(height: 24),
                _buildSendButton(state),
              ] else ...[
                _buildOtpView(state),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildSendButton(AuthState state) {
    final isLoading = state is AuthLoading;
    return ElevatedButton(
      onPressed: isLoading
          ? null
          : () {
              final phone = _phoneController.text.trim();
              if (phone.isEmpty) return;
              context.read<AuthBloc>().add(AuthSendOtpRequested(phone));
            },
      child: isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
          : const Text('Gửi mã OTP'),
    );
  }

  Widget _buildOtpView(AuthState state) {
    final isLoading = state is AuthLoading;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Xác minh OTP', style: AppTextStyles.title),
        const SizedBox(height: 8),
        Text(
          'Mã đã gửi đến $_maskedPhone',
          style: AppTextStyles.bodyMuted,
        ),
        const SizedBox(height: 24),
        TextField(
          controller: _otpController,
          keyboardType: TextInputType.number,
          maxLength: 6,
          style: const TextStyle(
            fontSize: 24,
            letterSpacing: 8,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
          decoration: const InputDecoration(
            hintText: '● ● ● ● ● ●',
            counterText: '',
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Text('Không nhận được mã? ', style: AppTextStyles.bodyMuted),
            TextButton(
              onPressed: _countdown > 0
                  ? null
                  : () {
                      context.read<AuthBloc>().add(AuthSendOtpRequested(_phoneController.text));
                    },
              child: Text(
                _countdown > 0 ? 'Gửi lại ($_countdown)' : 'Gửi lại',
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: isLoading ||
                  _otpController.text.replaceAll(RegExp(r'\D'), '').length < 6
              ? null
              : () {
                  context
                      .read<AuthBloc>()
                      .add(AuthVerifyOtpRequested(_otpController.text.trim()));
                },
          child: isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : const Text('Xác minh'),
        ),
        const SizedBox(height: 12),
        TextButton(
          onPressed: () => setState(() => _showOtp = false),
          child: const Text('← Đổi số điện thoại'),
        ),
      ],
    );
  }

  Widget _buildFooter() {
    return Text(
      '© 2026 Góc Nhà Mình',
      style: AppTextStyles.label,
      textAlign: TextAlign.center,
    );
  }
}
