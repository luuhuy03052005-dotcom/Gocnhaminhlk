import { useAuth } from '../../contexts/AuthContext';
import { customerApi } from '../../services/customerApi';
import { cn } from '../../utils/cn';
import { Phone, User, Camera, Check, AlertCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import type { CustomerProfile } from '../../contexts/AuthContext';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function ProfilePage() {
  const { user, session } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setFullName(session.fullName ?? '');
    }
  }, [session]);

  const handleSave = async () => {
    setSaveState('saving');
    setError('');

    try {
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const updated = await customerApi.updateProfile(token, { fullName: fullName.trim() || undefined });
      setFullName(updated.fullName ?? '');
      setAvatarUrl(updated.avatarUrl ?? '');
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err) {
      setSaveState('error');
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Page Title */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2017]">Tài khoản</h1>
          <p className="text-[#7A6A55] mt-1 text-sm">Quản lý thông tin cá nhân</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-[#EDE4D8] p-6 space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#F5EDE0] border-2 border-[#EDE4D8] overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#C8873A]">
                    {fullName ? fullName[0].toUpperCase() : (user?.phoneNumber?.slice(-2) ?? '??')}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#C8873A] text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#A06828] transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <p className="font-bold text-[#2C2017]">{fullName || 'Chưa đặt tên'}</p>
              <p className="text-sm text-[#7A6A55]">Ảnh đại diện</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF6EE]">
            <div className="w-10 h-10 rounded-full bg-[#EDE4D8] flex items-center justify-center">
              <Phone size={18} className="text-[#7A6A55]" />
            </div>
            <div>
              <p className="text-xs text-[#7A6A55] uppercase tracking-wider">Số điện thoại</p>
              <p className="font-semibold text-[#2C2017]">{user?.phoneNumber ?? session?.phoneNumber ?? '—'}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2C2017] mb-2">
              <User size={16} className="text-[#7A6A55]" />
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setSaveState('idle');
              }}
              placeholder="Nhập họ và tên của bạn"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE4D8] bg-[#FDF6EE] text-[#2C2017] placeholder:text-[#C8B8A2] focus:outline-none focus:ring-2 focus:ring-[#C8873A] focus:border-transparent transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={cn(
              'w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2',
              saveState === 'saving'
                ? 'bg-[#C8B8A2] cursor-not-allowed'
                : saveState === 'saved'
                ? 'bg-green-500 hover:bg-green-600'
                : saveState === 'error'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#C8873A] hover:bg-[#A06828] active:scale-[0.98]',
            )}
          >
            {saveState === 'saving' && 'Đang lưu...'}
            {saveState === 'saved' && (
              <>
                <Check size={18} /> Đã lưu thành công
              </>
            )}
            {saveState === 'error' && (
              <>
                <AlertCircle size={18} /> Lưu thất bại — Thử lại
              </>
            )}
            {saveState === 'idle' && 'Lưu thay đổi'}
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl border border-[#EDE4D8] p-6">
          <h2 className="font-serif text-lg font-bold text-[#2C2017] mb-4">Thông tin tài khoản</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7A6A55]">Vai trò</span>
              <span className="font-semibold text-[#2C2017] capitalize">{session?.role?.toLowerCase().replace('_', ' ') ?? 'Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A55]">Firebase UID</span>
              <span className="font-mono text-xs text-[#7A6A55]">{session?.firebaseUid?.slice(0, 12) ?? '—'}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A55]">Trạng thái</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
