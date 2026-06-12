import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { customerApi, type CustomerVoucher } from '../../services/customerApi';
import { cn } from '../../utils/cn';
import { Gift, Tag, Clock, AlertCircle, RefreshCw } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function isExpiringSoon(endDate: string): boolean {
  const diff = new Date(endDate).getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 3;
}

function isExpired(endDate: string): boolean {
  return new Date(endDate).getTime() < Date.now();
}

export function VoucherWalletPage() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<CustomerVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UNUSED' | 'USED' | 'EXPIRED'>('ALL');

  const loadVouchers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const data = await customerApi.getVouchers(token);
      setVouchers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tải voucher thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, [user]);

  const filtered = vouchers.filter((v) => {
    if (filter === 'ALL') return true;
    return v.status === filter;
  });

  const statusBadgeClass = (status: CustomerVoucher['status']) => {
    switch (status) {
      case 'UNUSED':
        return 'bg-green-100 text-green-700';
      case 'USED':
        return 'bg-gray-100 text-gray-500';
      case 'EXPIRED':
        return 'bg-red-100 text-red-600';
      case 'LOCKED':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const statusLabel = (status: CustomerVoucher['status']) => {
    switch (status) {
      case 'UNUSED': return 'Chưa dùng';
      case 'USED': return 'Đã dùng';
      case 'EXPIRED': return 'Hết hạn';
      case 'LOCKED': return 'Bị khóa';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#2C2017]">Ví Voucher</h1>
            <p className="text-[#7A6A55] mt-1 text-sm">
              {vouchers.length} voucher{vouchers.length !== 1 ? 's' : ''} trong ví
            </p>
          </div>
          <button
            onClick={loadVouchers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#C8873A] hover:bg-[#F5EDE0] transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'UNUSED', 'USED', 'EXPIRED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                filter === f
                  ? 'bg-[#C8873A] text-white'
                  : 'bg-white text-[#7A6A55] border border-[#EDE4D8] hover:bg-[#F5EDE0]',
              )}
            >
              {f === 'ALL' ? 'Tất cả' : f === 'UNUSED' ? 'Chưa dùng' : f === 'USED' ? 'Đã dùng' : 'Hết hạn'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-[#C8873A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <Gift size={48} className="mx-auto text-[#EDE4D8] mb-4" />
            <p className="font-serif text-xl font-bold text-[#2C2017]">Chưa có voucher nào</p>
            <p className="text-[#7A6A55] text-sm mt-1">Các voucher của bạn sẽ xuất hiện ở đây</p>
          </div>
        )}

        {/* Voucher List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((voucher) => {
              const expired = isExpired(voucher.voucher?.endDate ?? '');
              const expiringSoon = !expired && isExpiringSoon(voucher.voucher?.endDate ?? '');
              const isPercent = voucher.voucher?.type === 'PERCENT';

              return (
                <div
                  key={voucher.id}
                  className={cn(
                    'bg-white rounded-2xl border overflow-hidden',
                    expired ? 'border-gray-200 opacity-70' : 'border-[#EDE4D8]',
                    expiringSoon ? 'ring-2 ring-orange-300' : '',
                  )}
                >
                  {/* Voucher Body */}
                  <div className="flex">
                    {/* Left: Value */}
                    <div className={cn(
                      'w-28 shrink-0 flex flex-col items-center justify-center p-4',
                      expired ? 'bg-gray-100' : 'bg-[#C8873A]',
                    )}>
                      <span className="text-white text-2xl font-black">
                        {isPercent ? `${voucher.voucher?.value}%` : `${(voucher.voucher?.value ?? 0).toLocaleString('vi-VN')}`}
                      </span>
                      <span className="text-white/80 text-xs font-medium mt-1">
                        {isPercent ? 'GIẢM' : 'GIẢM'}
                      </span>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-[#2C2017] leading-tight">{voucher.voucher?.title}</h3>
                          {voucher.voucher?.description && (
                            <p className="text-xs text-[#7A6A55] mt-0.5 line-clamp-1">{voucher.voucher.description}</p>
                          )}
                        </div>
                        <span className={cn('shrink-0 px-2 py-0.5 rounded-full text-xs font-bold', statusBadgeClass(voucher.status))}>
                          {statusLabel(voucher.status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-[#7A6A55]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          HSD: {formatDate(voucher.voucher?.endDate ?? '')}
                        </span>
                        {voucher.voucher?.minOrderAmount && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            Đơn từ {(voucher.voucher.minOrderAmount).toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>

                      {expiringSoon && (
                        <p className="mt-2 text-xs font-semibold text-orange-500">
                          ⚡ Hết hạn trong 3 ngày!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
