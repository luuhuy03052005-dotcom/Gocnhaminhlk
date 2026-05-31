import { useRef, useState, useEffect, useCallback } from 'react';
import { siteData } from '../../config/siteData';
import type { CarouselHighlightItem } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface HighlightSliderProps {
  items?: CarouselHighlightItem[];
}

export const HighlightSlider = ({ items = siteData.highlights }: HighlightSliderProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const maxItems = items.length;
  const isCarousel = maxItems >= 2;

  const calculateProgress = useCallback(() => {
    if (!trackRef.current || !isCarousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    
    // Prevent division by zero
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setProgress(0);
      return;
    }
    
    const currentProgress = (scrollLeft / maxScroll) * 100;
    setProgress(Math.min(Math.max(currentProgress, 0), 100)); // clamp 0-100

  }, [isCarousel]);

  // Handle Resize and Scroll Events
  useEffect(() => {
    if (!isCarousel) return;
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => calculateProgress();
    const handleResize = () => calculateProgress();
    
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateProgress, isCarousel]);

  const handleNext = useCallback(() => {
    if (!trackRef.current) return;
    setHasInteracted(true);
    
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    // If at the end, do not loop
    if (scrollLeft >= maxScroll - 10) return;

    const gap = 24; // gap-6
    const cardWidth = trackRef.current.children[0]?.clientWidth || 0;
    const scrollStep = cardWidth + gap;

    trackRef.current.scrollTo({
      left: scrollLeft + scrollStep,
      behavior: 'smooth'
    });
  }, []);

  const handlePrev = () => {
    if (!trackRef.current) return;
    setHasInteracted(true);
    
    const { scrollLeft } = trackRef.current;
    if (scrollLeft <= 0) return;

    const gap = 24;
    const cardWidth = trackRef.current.children[0]?.clientWidth || 0;
    const scrollStep = cardWidth + gap;

    trackRef.current.scrollTo({
      left: scrollLeft - scrollStep,
      behavior: 'smooth'
    });
  };

  // Handle Autoplay (Desktop only, strict rules)
  useEffect(() => {
    if (!isCarousel || hasInteracted || isHovered) return;

    // A11y: Reduce motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    // Desktop only check rough logic based on window width
    if (window.innerWidth < 1024) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Slower 6s autoplay

    return () => clearInterval(interval);
  }, [isHovered, hasInteracted, isCarousel, handleNext]);

  const handleTouch = () => {
    setHasInteracted(true);
  };

  if (items.length === 0) return null;

  return (
    <section className="bg-[#FFFFFF] py-16 md:py-20 overflow-hidden border-b border-[#EDE4D8]">
      <div className="container max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="flex-1 max-w-2xl">
            <RevealWrapper delay={0.1}>
              <Typography variant="badge" className="mb-4">Nổi Bật</Typography>
              <Typography variant="h2" className="text-[#2C2017] leading-tight">
                Ưu đãi & Các Món Trứ Danh
              </Typography>
            </RevealWrapper>
          </div>

          {/* Nav Buttons - Hidden on Mobile */}
          {isCarousel && (
            <div className="hidden md:flex gap-4 shrink-0">
              <button 
                onClick={handlePrev} 
                disabled={progress <= 1}
                aria-label="Previous slide"
                className="w-14 h-14 rounded-full border border-[#EDE4D8] text-[#2C2017] flex items-center justify-center transition-all duration-300 hover:bg-[#FDF6EE] hover:border-[#C8873A] disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8873A] focus-visible:ring-offset-2 bg-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={handleNext} 
                disabled={progress >= 99}
                aria-label="Next slide"
                className="w-14 h-14 rounded-full border border-[#EDE4D8] text-[#2C2017] flex items-center justify-center transition-all duration-300 hover:bg-[#FDF6EE] hover:border-[#C8873A] disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8873A] focus-visible:ring-offset-2 bg-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Carousel / Grid Wrapper */}
        <RevealWrapper delay={0.3}>
          <div 
            className="w-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouch}
          >
            <ul 
              ref={trackRef}
              className={cn(
                "flex gap-6 pb-6 overflow-x-auto scrollbar-hide items-stretch", 
                isCarousel ? "snap-x snap-mandatory" : "flex-wrap md:flex-nowrap"
              )}
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              role="region"
              aria-label="Highlight Carousel"
              tabIndex={0}
            >
              {items.map((item) => (
                <li 
                  key={item.id}
                  className={cn(
                    "snap-start shrink-0 h-auto flex flex-col",
                    isCarousel 
                      ? "w-[85vw] md:w-[45vw] lg:w-[calc(33.3333%-16px)]" 
                      : "w-full md:w-[45vw] lg:w-[calc(33.3333%-16px)]"
                  )}
                  aria-roledescription="slide"
                >
                  <CardRender item={item} />
                </li>
              ))}
            </ul>

            {/* A11y Slim Progress Bar */}
            {isCarousel && (
              <div aria-hidden="true" className="w-full h-[2px] bg-[#EBE0CF] rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-[#C8873A] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

// Sub-Component logic separating the union types
const CardRender = ({ item }: { item: CarouselHighlightItem }) => {
  return (
    <div className="bg-[#FDF6EE] border border-[#EDE4D8] rounded-[24px] overflow-hidden flex flex-col h-full focus-within:ring-2 focus-within:ring-[#C8873A] focus-within:ring-offset-2 transition-all hover:shadow-brand group">
      
      {/* Image Block: Strictly 4:3 Aspect Ratio with stable fallback */}
      <div className="relative w-full aspect-[4/5] bg-[#EBE0CF] overflow-hidden shrink-0">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Image Fallback
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center">
             <img src={siteData.brand.logo} alt="Góc Nhà Mình Logo" className="w-20 opacity-20 grayscale" />
           </div>
        )}
        {item.badge && (
          <div className="absolute top-4 left-4 bg-[#2C2017] text-[#FDF6EE] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
            {item.badge}
          </div>
        )}
      </div>

      {/* Content Block: Stretches and anchors CTA */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        
        {item.subtitle && (
          <Typography variant="caption" className="mb-2 uppercase tracking-[0.15em] text-[#C8873A] font-bold text-xs">
            {item.subtitle}
          </Typography>
        )}

        <div className="flex justify-between items-start gap-4 mb-4">
          <Typography variant="h3" as="h3" className="text-[1.5rem] leading-snug line-clamp-2 pt-1 font-semibold">
            {item.title}
          </Typography>
          {item.type === 'menu' && item.price && (
             <span className="font-sans font-bold text-[#A06828] text-lg shrink-0 pt-1">
               {item.price}
             </span>
          )}
        </div>

        {item.description && (
          <Typography variant="body" className="line-clamp-3 text-sm md:text-base leading-relaxed text-[#6A5A4A] mb-8">
            {item.description}
          </Typography>
        )}

        {/* Anchored CTA Container at the bottom using mt-auto */}
        <div className="mt-auto w-full pt-6">
          <Button 
            href={item.ctaLink || '#'} 
            variant="ghost" 
            className="w-full h-12 flex items-center justify-between px-0 hover:bg-transparent hover:text-[#C8873A] border-t border-[#EDE4D8] rounded-none pt-4 text-[0.8125rem]"
          >
            <span>{item.ctaLabel || 'Xem Thêm'}</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </div>

      </div>
    </div>
  );
};
