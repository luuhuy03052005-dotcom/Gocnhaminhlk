import { siteData } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { RevealWrapper } from '../ui/RevealWrapper';
import { CoffeeBeansPattern, CurvedLines } from '../ui/SectionDecor';

export const LocationContactSection = () => {
  return (
    <section id="location" className="bg-[#F5EDE0] pt-24 pb-8 md:pt-32 md:pb-12 relative overflow-hidden">
      <CoffeeBeansPattern />
      <CurvedLines />
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Info & CTA */}
          <div className="lg:col-span-6 flex flex-col order-2 lg:order-1 pr-0 lg:pr-8">
            <RevealWrapper delay={0.1}>
              <Typography variant="h2" className="mb-12 max-w-[500px]">
                Góc đón chờ bạn.
              </Typography>
            </RevealWrapper>
            
            <RevealWrapper delay={0.2} className="mb-8 flex flex-col">
              <Typography variant="caption" className="mb-3 uppercase tracking-[0.2em] text-[#C8873A] font-bold">Giờ Mở Cửa</Typography>
              <Typography variant="h3" className="font-serif text-3xl md:text-4xl text-[#2C2017]">
                {siteData.brand.openHours}
              </Typography>
            </RevealWrapper>

            <RevealWrapper delay={0.3} className="mb-12 flex flex-col">
              <Typography variant="caption" className="mb-3 uppercase tracking-[0.2em] text-[#C8873A] font-bold">Địa Chỉ</Typography>
              <Typography variant="body" className="max-w-[340px] text-[#2C2017] mb-4 text-[1.25rem] leading-snug">
                {siteData.brand.address}
              </Typography>
            </RevealWrapper>

            {/* Dual CTA — Wireframe: [Chỉ đường] [Zalo] */}
            <RevealWrapper delay={0.4} className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch w-full">
              <Button href={siteData.brand.googleMapUrl} target="_blank" variant="primary" className="w-full sm:w-auto shadow-brand h-14 px-10 text-[0.875rem] uppercase tracking-[0.1em]">
                Chỉ đường tới quán
              </Button>
              <Button href={siteData.brand.zalo} target="_blank" variant="secondary" className="w-full sm:w-auto h-14 px-10 text-[0.875rem] uppercase tracking-[0.1em]">
                Nhắn qua Zalo
              </Button>
            </RevealWrapper>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-6 relative order-1 lg:order-2 mt-8 lg:mt-0">
            <RevealWrapper delay={0.2} className="w-full relative group">
              
              {/* Offset Decorative Frame */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-6 rounded-[2rem] border border-[#D2BFAD] bg-[#FDF6EE] transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-3 z-0"></div>
              
              {/* Main Map Box */}
              <div className="relative z-10 w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#EBE0CF] border-8 border-white shadow-brand">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.3123525077704!2d107.2425264260055!3d10.92146936343225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174ff000ca06c8f%3A0x89d32846204e3a7d!2zR8OzYyBOaMOgIE3DrG5oIGPDoCBwaMOqIHbDoCB0csOg!5e0!3m2!1svi!2s!4v1774956031996!5m2!1svi!2s" 
                  className="w-full h-full border-0 absolute inset-0 filter saturate-[0.85] contrast-[1.05]" 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ Góc Nhà Mình"
                ></iframe>
              </div>

              {/* Floating Ticket / Badge */}
              <div className="absolute z-20 -bottom-6 right-4 md:-right-6 bg-[#2C2017] border-4 border-white text-[#FDF6EE] px-6 py-4 rounded-xl shadow-lg rotate-[3deg] transition-transform duration-500 group-hover:rotate-0">
                <Typography variant="caption" className="text-[#C8873A] font-bold tracking-widest uppercase mb-1 drop-shadow-sm text-[10px] md:text-xs">Chạm để mở Maps</Typography>
                <div className="font-serif text-lg md:text-xl font-bold">Dẫn lối về Góc</div>
              </div>
            </RevealWrapper>
          </div>
        </div>

      </div>
    </section>
  );
};
