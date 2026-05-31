import { siteData } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { RevealWrapper } from '../ui/RevealWrapper';
import { LeafCorner, WarmGlow } from '../ui/SectionDecor';

export const PromoSection = () => {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#FDF6EE] flex items-center justify-center overflow-hidden">
      <LeafCorner />
      <WarmGlow />
      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <RevealWrapper delay={0.1}>
          {/* Floating Minimal Box */}
          <div className="w-full bg-white rounded-[2rem] shadow-sm border border-[#EDE4D8] overflow-hidden flex flex-col md:flex-row h-auto md:h-[480px]">
             
             {/* Text Side */}
             <div className="flex-1 p-10 md:p-14 flex flex-col justify-center order-2 md:order-1">
                <Typography variant="h2" className="text-[#2C2017] mb-6 max-w-[400px]">
                  Cuối tuần này, hẹn nhau ở Góc.
                </Typography>
                <Typography variant="body" className="mb-10 text-[#7A6A55] max-w-sm">
                  Quán đã chuẩn bị sẵn những ly cà phê ấm, và không gian tĩnh lặng đủ vừa vặn để bạn lướt qua những bộn bề.
                </Typography>
                <Button href={siteData.brand.googleMapUrl} target="_blank" className="w-max h-14 px-8 text-[0.875rem] uppercase tracking-[0.1em]">
                  Chỉ đường tới quán
                </Button>
             </div>

             {/* Minimal Visual Side */}
             <div className="w-full md:w-2/5 h-[300px] md:h-full relative bg-[#EBE0CF] order-1 md:order-2 shrink-0">
                <img 
                  src={siteData.images.promo} 
                  alt="Hẹn ở Góc" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
             </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};
