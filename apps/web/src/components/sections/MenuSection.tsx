import { siteData } from '../../config/siteData';
import type { MenuCategory } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';
import { CoffeeBeansPattern, GrainOverlay } from '../ui/SectionDecor';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface MenuSectionProps {
  categories?: MenuCategory[];
}

export const MenuSection = ({ categories = siteData.menu.categories }: MenuSectionProps) => {
  return (
    <section id="menu" className="bg-[#FDF6EE] py-24 md:py-32 relative overflow-hidden">
      <GrainOverlay />
      <CoffeeBeansPattern />
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <RevealWrapper delay={0.1}>
            <Typography variant="badge" className="mb-4">Menu</Typography>
            <Typography variant="h2" className="text-[#2C2017] mb-6">
              Thực Đơn Tại Quán
            </Typography>
            <div className="w-16 h-[1px] bg-[#C8873A] mx-auto"></div>
          </RevealWrapper>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left: Featured Image Block (Sticky) */}
          <div className="w-full lg:w-[35%] xl:w-[30%] lg:sticky lg:top-24 hidden lg:block">
            <RevealWrapper delay={0.1}>
              <div className="bg-white rounded-2xl p-6 h-full flex flex-col items-start border border-[#EDE4D8] shadow-sm transform transition-all duration-300">
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#EBE0CF] mb-6">
                  <img 
                    src={siteData.menu.featured.image} 
                    alt={siteData.menu.featured.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Typography variant="badge" className="bg-[#C8873A] text-white border-transparent self-start mb-2">
                    {siteData.menu.featured.badge}
                  </Typography>
                  <Typography variant="h3" className="text-2xl leading-tight">
                    {siteData.menu.featured.name}
                  </Typography>
                  <div className="font-sans font-bold text-xl text-[#A06828]">
                    {siteData.menu.featured.price}
                  </div>
                  <Typography variant="body" className="text-sm mt-2 text-[#6A5A4A]">
                    {siteData.menu.featured.desc}
                  </Typography>
                </div>
              </div>
            </RevealWrapper>
            
            {/* Goka Delivery Block */}
            <RevealWrapper delay={0.2} className="mt-8">
              <div className="w-full bg-white border border-[#EDE4D8] rounded-2xl p-6 flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center shrink-0">
                    <span className="font-bold text-black text-[9px] tracking-widest uppercase">Goka</span>
                  </div>
                  <Typography variant="h4" className="text-lg font-bold text-[#2C2017]">
                    Giao Tận Nơi
                  </Typography>
                </div>
                <Button href={siteData.brand.goka} target="_blank" variant="secondary" className="w-full py-2.5 text-xs uppercase tracking-wider">
                  Mở App Ngay
                </Button>
              </div>
            </RevealWrapper>
          </div>

          {/* Right: The Print Typographic Menu */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <div className="columns-1 md:columns-2 gap-x-12 lg:gap-x-16">
              
              {/* Render all categories continuously */}
              {categories.map((category, catIdx) => (
                <div key={category.id} className="mb-12 break-inside-avoid">
                  <RevealWrapper delay={catIdx * 0.05}>
                    {/* Category Title */}
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="font-sans font-bold text-xl tracking-[0.15em] text-[#C8873A] uppercase">
                        {category.name}
                      </h3>
                      <div className="flex-1 h-[1px] bg-[#C8873A]/20"></div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-4">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex flex-col">
                          <div className="flex items-baseline w-full gap-2">
                            {/* Item Name */}
                            <span className="font-serif text-[1.125rem] md:text-[1.25rem] text-[#2C2017] flex items-center gap-1.5 shrink-0">
                              {item.name}
                              {item.isBestSeller && (
                                <Star className="w-3.5 h-3.5 fill-[#C8873A] text-[#C8873A] mb-0.5" />
                              )}
                            </span>
                            
                            {/* Dotted Line connector */}
                            <div className="flex-1 border-b-2 border-dotted border-[#C8873A]/30 mx-1 relative top-[-4px]"></div>
                            
                            {/* Price */}
                            <span className="font-sans font-bold text-[#A06828] text-lg shrink-0">
                              {item.price}
                            </span>
                          </div>
                          
                          {/* Optional Description underneath item */}
                          {item.desc && (
                            <Typography variant="body" className="text-[0.85rem] mt-1 text-[#6A5A4A] italic max-w-[85%] leading-relaxed">
                              {item.desc}
                            </Typography>
                          )}
                        </div>
                      ))}
                    </div>
                  </RevealWrapper>
                </div>
              ))}
              
            </div>
            
            {/* Mobile Goka Block Backup */}
            <div className="mt-8 lg:hidden block">
              <Button href={siteData.brand.goka} target="_blank" className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black border-none font-bold">
                Đặt Giao Hàng Qua Goka
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
