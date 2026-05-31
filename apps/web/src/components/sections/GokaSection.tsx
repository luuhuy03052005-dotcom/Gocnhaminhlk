import { siteData } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { RevealWrapper } from '../ui/RevealWrapper';

export const GokaSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FDF6EE] py-20 md:py-28">
      {/* Subtle warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8E8C8] via-[#FDF6EE] to-[#FCEBD4] opacity-60 z-0"></div>
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Text Content */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <RevealWrapper delay={0.1}>
              <Typography variant="badge" className="mb-6">Đặt món Online</Typography>
            </RevealWrapper>

            <RevealWrapper delay={0.15}>
              <Typography variant="h2" className="mb-6 text-[#2C2017] max-w-[480px]">
                Góc Nhà Mình <br className="hidden md:block" />đã có trên <span className="text-[#C8873A]">Goka</span>
              </Typography>
            </RevealWrapper>
            
            <RevealWrapper delay={0.2}>
              <Typography variant="body" className="mb-10 max-w-[440px] text-lg leading-relaxed">
                Không cần ra khỏi nhà vẫn thưởng thức trọn vẹn hương vị Góc. Mở app, chọn món yêu thích, và chờ shipper giao tận nơi chỉ trong 15 phút.
              </Typography>
            </RevealWrapper>

            <RevealWrapper delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <Button 
                  href={siteData.brand.goka} 
                  target="_blank" 
                  variant="primary" 
                  className="w-full sm:w-auto shadow-brand h-14 px-10 text-[0.875rem] uppercase tracking-[0.1em]"
                >
                  Đặt ngay trên Goka
                </Button>
                <a 
                  href="#menu" 
                  className="text-[0.875rem] font-bold tracking-[0.1em] uppercase text-[#7A6A55] hover:text-[#C8873A] transition-colors relative group py-2 flex items-center gap-2"
                >
                  Xem Menu
                  <span className="w-0 h-[2px] bg-[#C8873A] absolute bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </RevealWrapper>

            {/* Trust badges */}
            <RevealWrapper delay={0.3}>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#EDE4D8] w-full max-w-[440px]">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl font-bold text-[#C8873A]">15'</span>
                  <span className="text-xs text-[#7A6A55] uppercase tracking-wider mt-1">Giao nhanh</span>
                </div>
                <div className="w-[1px] h-10 bg-[#EDE4D8]"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl font-bold text-[#C8873A]">5.0 ⭐</span>
                  <span className="text-xs text-[#7A6A55] uppercase tracking-wider mt-1">Đánh giá</span>
                </div>
                <div className="w-[1px] h-10 bg-[#EDE4D8]"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl font-bold text-[#C8873A]">10%</span>
                  <span className="text-xs text-[#7A6A55] uppercase tracking-wider mt-1">Giảm giá</span>
                </div>
              </div>
            </RevealWrapper>
          </div>

          {/* Right Side: Goka Banner Image */}
          <div className="lg:col-span-7 relative flex justify-center order-1 lg:order-2">
            <RevealWrapper delay={0.2} className="w-full flex justify-center">
              <div className="relative w-full max-w-[560px]">
                {/* Decorative circle behind image */}
                <div className="absolute -top-8 -right-8 w-[70%] aspect-square rounded-full bg-gradient-to-br from-[#F5D590] to-[#FCEBD4] opacity-40 blur-3xl z-0"></div>
                
                {/* Main Image */}
                <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl bg-[#EBE0CF]">
                  <img 
                    src={siteData.images.gokaBanner}
                    alt="Góc Nhà Mình trên ứng dụng Goka" 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </RevealWrapper>
          </div>

        </div>
      </div>
    </section>
  );
};
