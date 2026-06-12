import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { customerApi, type CustomerNotification } from '../../services/customerApi';
import { cn } from '../../utils/cn';
import { Bell, BellOff, Check, RefreshCw, AlertCircle } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

const typeBadge = (type: CustomerNotification['notification'] extends { type: infer T } ? T : never) => {
  switch (type) {
    case 'PROMOTION': return { label: 'Khuyến mãi', class: 'bg-pink-100 text-pink-700' };
    case 'ORDER': return { label: 'Đơn hàng', class: 'bg-blue-100 text-blue-700' };
    case 'VOUCHER': return { label: 'Voucher', class: 'bg-amber-100 text-amber-700' };
    case 'SYSTEM': return { label: 'Hệ thống', class: 'bg-gray-100 text-gray-600' };
    default: return { label: 'Thông báo', class: 'bg-gray-100 text-gray-600' };
  }
};

export function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const data = await customerApi.getNotifications(token);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tải thông báo thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkRead = async (notificationId: string) => {
    setMarkingId(notificationId);
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      await customerApi.markNotificationRead(token, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n,
        ),
      );
    } catch {
      // silently ignore — still allow user to continue
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#2C2017]">Thông báo</h1>
            <p className="text-[#7A6A55] mt-1 text-sm">
              {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
            </p>
          </div>
          <button
            onClick={loadNotifications}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#C8873A] hover:bg-[#F5EDE0] transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
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
        {!loading && !error && notifications.length === 0 && (
          <div className="text-center py-16">
            <BellOff size={48} className="mx-auto text-[#EDE4D8] mb-4" />
            <p className="font-serif text-xl font-bold text-[#2C2017]">Không có thông báo</p>
            <p className="text-[#7A6A55] text-sm mt-1">Bạn sẽ nhận thông báo khi có cập nhật mới</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const n = notification.notification;
              if (!n) return null;

              const badge = typeBadge(n.type as Parameters<typeof typeBadge>[0]);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'bg-white rounded-2xl border p-4 transition-all',
                    notification.isRead
                      ? 'border-[#EDE4D8] opacity-70'
                      : 'border-[#C8873A] shadow-sm',
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn(
                      'w-10 h-10 shrink-0 rounded-full flex items-center justify-center',
                      notification.isRead ? 'bg-[#F5EDE0]' : 'bg-[#C8873A]/10',
                    )}>
                      <Bell size={18} className={notification.isRead ? 'text-[#C8B8A2]' : 'text-[#C8873A]'} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className={cn(
                              'font-bold text-sm leading-tight',
                              notification.isRead ? 'text-[#7A6A55]' : 'text-[#2C2017]',
                            )}>
                              {n.title}
                            </p>
                            <span className={cn('shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold', badge.class)}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#7A6A55] leading-relaxed line-clamp-2">{n.content}</p>
                          <p className="text-xs text-[#C8B8A2] mt-1">{timeAgo(notification.createdAt)}</p>
                        </div>

                        {/* Mark read button */}
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            disabled={markingId === notification.id}
                            className="shrink-0 w-8 h-8 rounded-full border border-[#C8873A] text-[#C8873A] flex items-center justify-center hover:bg-[#C8873A] hover:text-white transition-colors disabled:opacity-50"
                            title="Đánh dấu đã đọc"
                          >
                            {markingId === notification.id ? (
                              <div className="w-3 h-3 border-2 border-[#C8873A] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                          </button>
                        )}
                      </div>
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
