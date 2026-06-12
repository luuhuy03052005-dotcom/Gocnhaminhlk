import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';
import { LogOut, Bell, Wallet, User, Menu, X } from 'lucide-react';

export function PortalHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/portal/profile', label: 'Tài khoản', icon: User },
    { to: '/portal/vouchers', label: 'Ví Voucher', icon: Wallet },
    { to: '/portal/notifications', label: 'Thông báo', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-[#2C2017] text-[#FDF6EE] text-xs">
        <div className="mx-auto max-w-7xl h-9 px-6 flex items-center justify-end">
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#C8873A]/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#C8873A]">
                {user?.phoneNumber?.slice(-2) ?? '??'}
              </span>
            </div>
            {user?.phoneNumber ?? 'Khách hàng'}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'fixed inset-x-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#EDE4D8]',
          isScrolled ? 'top-0 h-16' : 'top-9 h-20',
        )}
      >
        <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-3"
          >
            <img
              src="https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,r_max,g_auto,f_webp,q_auto/v1/samples/animals/cat"
              alt="Logo Góc Nhà Mình"
              className="w-10 h-10 rounded-full object-cover border border-[#EDE4D8]"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-lg text-[#2C2017] tracking-tight">Góc Nhà Mình</span>
              <span className="hidden lg:block text-[10px] text-[#7A6A55] uppercase tracking-[0.2em]">cà phê và trà</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200',
                    isActive
                      ? 'text-[#C8873A] bg-[#FDF6EE]'
                      : 'text-[#2C2017] hover:text-[#C8873A] hover:bg-[#F5EDE0]',
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5EDE0] flex items-center justify-center text-[#C8873A] font-bold text-sm">
                {user?.phoneNumber?.slice(-2) ?? '??'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-[#7A6A55] hover:text-[#2C2017] transition-colors"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#F5EDE0] text-[#2C2017]"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FDF6EE] flex flex-col justify-center items-center px-6">
          <button
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col gap-6 text-center items-center">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 font-serif text-3xl font-semibold text-[#2C2017] hover:text-[#C8873A] transition-colors"
              >
                <Icon size={28} />
                {label}
              </Link>
            ))}

            <div className="h-px w-16 bg-[#EDE4D8] my-2" />

            <button
              onClick={async () => {
                setIsMobileMenuOpen(false);
                await handleLogout();
              }}
              className="flex items-center gap-3 font-serif text-3xl font-semibold text-red-500"
            >
              <LogOut size={28} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </>
  );
}
