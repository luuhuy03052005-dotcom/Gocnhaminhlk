import { useState, useEffect, useRef } from 'react';
import { siteData } from '../../config/siteData';
import { cn } from '../../utils/cn';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';

// Tạo interface cho nav items có dropdown
interface NavDropdownItem {
  label: string;
  href: string;
  dropdown?: {
    title: string;
    items: { label: string; desc?: string; href: string }[];
  };
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Delay close để tránh flicker khi di chuột giữa nav link và dropdown panel
  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const navLinks: NavDropdownItem[] = [
    { 
      label: 'Thực đơn', 
      href: '#menu',
      dropdown: {
        title: 'Thử ngay các Best Seller nhà Góc!',
        items: [
          { label: 'Cà phê / Coffee', href: '#menu' },
          { label: 'Trà Trái Cây / Tea', href: '#menu' },
          { label: 'Trà Sữa / Milk Tea', href: '#menu' },
          { label: 'Đá Xay / Ice Blended', href: '#menu' },
        ]
      }
    },
    { label: 'Không gian', href: '#gallery' },
    { label: 'Tìm đường', href: '#location' },
    { label: 'Tuyển dụng', href: '#tuyen-dung' },
    { label: 'Đặt hàng', href: siteData.brand.goka },
  ];

  return (
    <>
      {/* ===== ROW 1: Top Contact Bar ===== */}
      <div className={cn(
        "hidden md:block bg-[#2C2017] text-[#FDF6EE] text-xs transition-all duration-300 z-50 fixed top-0 inset-x-0",
        isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-9"
      )}>
        <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={siteData.brand.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#C8873A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a href={siteData.brand.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#C8873A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              TikTok
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {siteData.brand.openHours}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {siteData.brand.address}
            </span>
          </div>
        </div>
      </div>

      {/* ===== ROW 2: Main Header ===== */}
      <header
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#EDE4D8]",
          isScrolled 
            ? "top-0 h-16 shadow-sm" 
            : "md:top-9 top-0 h-20"
        )}
      >
        <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <a href="#" className="flex-shrink-0 flex items-center gap-3">
            <img 
              src={siteData.brand.logo} 
              alt="Logo Góc Nhà Mình" 
              className="w-10 h-10 rounded-full object-cover border border-[#EDE4D8]" 
            />
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-lg text-[#2C2017] tracking-tight">{siteData.brand.name}</span>
              <span className="hidden lg:block text-[10px] text-[#7A6A55] uppercase tracking-[0.2em]">cà phê và trà</span>
            </div>
          </a>

          {/* Desktop Nav with Dropdowns */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className={cn(
                    "text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 block",
                    activeDropdown === link.label
                      ? "text-[#C8873A] bg-[#FDF6EE]"
                      : "text-[#2C2017] hover:text-[#C8873A] hover:bg-[#F5EDE0]"
                  )}
                >
                  {link.label}
                </a>

                {/* Dropdown Panel */}
                {link.dropdown && activeDropdown === link.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[520px] bg-white rounded-2xl shadow-xl border border-[#EDE4D8] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <p className="font-serif text-lg font-bold text-[#2C2017] mb-4">
                      {link.dropdown.title}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {link.dropdown.items.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDF6EE] transition-colors group"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#C8873A] opacity-60 group-hover:opacity-100 shrink-0 transition-opacity"></div>
                          <span className="text-sm font-medium text-[#2C2017] group-hover:text-[#C8873A] transition-colors">
                            {subItem.label}
                          </span>
                        </a>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#EDE4D8]">
                      <a href="#menu" className="text-sm font-bold text-[#C8873A] hover:text-[#A06828] uppercase tracking-wider transition-colors">
                        Xem toàn bộ Menu →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Hotline + Social Icons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href={siteData.brand.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#2C2017] text-white flex items-center justify-center hover:bg-[#C8873A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={siteData.brand.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-8 h-8 rounded-full bg-[#2C2017] text-white flex items-center justify-center hover:bg-[#C8873A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>

            <div className="w-[1px] h-6 bg-[#EDE4D8]"></div>
            
            {/* Hotline */}
            <a
              href={`tel:${siteData.brand.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-sm font-bold text-[#C8873A] hover:text-[#A06828] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#C8873A]/10 flex items-center justify-center">
                <Phone size={14} className="text-[#C8873A]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-[#7A6A55] font-normal uppercase tracking-wider">Hotline</span>
                <span>{siteData.brand.phone}</span>
              </div>
            </a>
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#F5EDE0] text-[#2C2017]"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ===== Mobile Menu Overlay ===== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FDF6EE] flex flex-col justify-center items-center px-6">
          <button
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col gap-6 text-center items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-3xl font-semibold text-[#2C2017] hover:text-[#C8873A] transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            <div className="h-px w-16 bg-[#EDE4D8] my-2"></div>
            
            <a
              href={`tel:${siteData.brand.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-lg font-bold text-[#C8873A]"
            >
              <Phone size={18} />
              {siteData.brand.phone}
            </a>

            <div className="flex items-center gap-4 mt-4">
              <a href={siteData.brand.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full bg-[#2C2017] text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={siteData.brand.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-12 h-12 rounded-full bg-[#2C2017] text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href={siteData.brand.zalo} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs font-bold">
                Zalo
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
