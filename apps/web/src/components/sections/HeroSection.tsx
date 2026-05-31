import { siteData } from '../../config/siteData';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';
import { GrainOverlay } from '../ui/SectionDecor';

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FDF6EE] min-h-[70vh] lg:min-h-screen">
      <GrainOverlay />
      
      {/* Warm ambient glow behind content */}
      <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#C8873A]/[0.04] blur-[100px] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#A06828]/[0.05] blur-[80px] pointer-events-none z-0" aria-hidden="true" />

      {/* ===== CONTENT GRID ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 md:pt-44 lg:pt-48 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* ===== LEFT: Text Block — 6 columns ===== */}
        <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col items-start justify-center">
          
          <RevealWrapper delay={0.0}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[1px] bg-[#C8873A]"></div>
              <Typography variant="badge">Góc chill an yên của bạn</Typography>
            </div>
          </RevealWrapper>

          <RevealWrapper delay={0.1}>
            <h1 className="font-serif text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-bold text-[#2C2017] leading-[1.1] tracking-tight mb-8 max-w-[600px]">
              Góc nhỏ <br className="hidden sm:block" />
              <span className="text-[#C8873A]">bình yên</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={0.2}>
            <Typography variant="body" className="mb-10 max-w-[480px] text-lg md:text-xl leading-relaxed">
              Thả chậm nhịp sống và tận hưởng hương vị cà phê mộc mạc trong một không gian tựa như nhà. Nơi bạn có thể thực sự nghỉ ngơi.
            </Typography>
          </RevealWrapper>

          <RevealWrapper delay={0.3} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Button href={siteData.brand.googleMapUrl} target="_blank" className="sm:w-auto h-14 px-10 text-[0.875rem] uppercase tracking-[0.12em] shadow-brand">
              Chỉ đường tới quán
            </Button>
            <a href="#menu" className="text-[0.875rem] font-bold tracking-[0.12em] uppercase text-[#7A6A55] hover:text-[#C8873A] transition-colors relative group py-2 flex items-center gap-2">
              Xem Menu
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              <span className="w-0 h-[2px] bg-[#C8873A] absolute bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </RevealWrapper>

          {/* Trust strip */}
          <RevealWrapper delay={0.4} className="mt-12 pt-8 border-t border-[#EDE4D8] w-full max-w-[480px]">
            <div className="flex items-center gap-8 text-center">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#C8873A]">5.0</span>
                <span className="text-[10px] text-[#7A6A55] uppercase tracking-widest mt-1">Đánh giá</span>
              </div>
              <div className="w-[1px] h-10 bg-[#EDE4D8]"></div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#C8873A]">07:00</span>
                <span className="text-[10px] text-[#7A6A55] uppercase tracking-widest mt-1">Mở cửa</span>
              </div>
              <div className="w-[1px] h-10 bg-[#EDE4D8]"></div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#C8873A]">100%</span>
                <span className="text-[10px] text-[#7A6A55] uppercase tracking-widest mt-1">Thủ công</span>
              </div>
            </div>
          </RevealWrapper>
        </div>

        {/* ===== RIGHT: Multi-image Mosaic — 6 columns ===== */}
        <div className="order-1 lg:order-2 lg:col-span-6 relative h-[420px] sm:h-[500px] lg:h-[620px]">
          
          {/* Main hero image — large, offset */}
          <RevealWrapper delay={0.2} className="absolute top-0 right-0 w-[72%] h-[85%] z-20">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden shadow-2xl bg-[#EBE0CF] group">
              <img 
                src={siteData.images.hero} 
                alt="Không gian Góc Nhà Mình" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="eager"
              />
            </div>
          </RevealWrapper>

          {/* Secondary image — storefront, bottom-left overlap */}
          <RevealWrapper delay={0.4} className="absolute bottom-0 left-0 w-[50%] h-[55%] z-30">
            <div className="w-full h-full rounded-[1.25rem] overflow-hidden shadow-xl border-4 border-white bg-[#EBE0CF] group">
              <img 
                src={siteData.images.heroStorefront} 
                alt="Mặt tiền quán Góc Nhà Mình" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="eager"
              />
            </div>
          </RevealWrapper>

          {/* Decorative offset frame — behind main image */}
          <div className="absolute top-4 right-[-12px] w-[72%] h-[85%] rounded-[1.5rem] border border-[#D2BFAD] bg-[#F5EDE0]/50 z-10 pointer-events-none" aria-hidden="true" />
          
          {/* Floating badge — top right */}
          <RevealWrapper delay={0.5} className="absolute -top-3 right-[-8px] z-40">
            <div className="bg-[#2C2017] text-[#FDF6EE] px-5 py-3 rounded-xl shadow-lg rotate-[3deg] hover:rotate-0 transition-transform duration-500">
              <div className="text-[10px] text-[#C8873A] font-bold uppercase tracking-widest mb-0.5">Mở cửa</div>
              <div className="font-serif text-lg font-bold">07:00 – 22:30</div>
            </div>
          </RevealWrapper>

          {/* Floating stars badge — bottom-right of secondary image */}
          <RevealWrapper delay={0.6} className="absolute bottom-[-12px] left-[42%] z-40">
            <div className="bg-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-[#EDE4D8]">
              <span className="text-[#C8873A] text-sm">★★★★★</span>
              <span className="text-xs font-semibold text-[#2C2017]">5.0</span>
            </div>
          </RevealWrapper>
        </div>
      </div>

      {/* ===== SCROLLING MARQUEE ===== */}
      <div className="relative z-10 w-full overflow-hidden border-t border-b border-[#EDE4D8] bg-white/50 backdrop-blur-sm py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-10 text-[#7A6A55]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 shrink-0">
              <span className="font-serif text-lg italic">Cà phê thủ công</span>
              <span className="text-[#C8873A]">✦</span>
              <span className="font-serif text-lg italic">Không gian vintage</span>
              <span className="text-[#C8873A]">✦</span>
              <span className="font-serif text-lg italic">Giao hàng Goka</span>
              <span className="text-[#C8873A]">✦</span>
              <span className="font-serif text-lg italic">Trà sữa Ô Long</span>
              <span className="text-[#C8873A]">✦</span>
              <span className="font-serif text-lg italic">Free topping check-in</span>
              <span className="text-[#C8873A]">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
