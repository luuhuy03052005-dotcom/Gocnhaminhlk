import { useRef, useState, useEffect, useCallback } from 'react';
import { Typography } from './Typography';
import { cn } from '../../utils/cn';
import type { GalleryItem } from '../../config/siteData';

interface PremiumCarouselProps {
  data: GalleryItem[];
  autoPlayInterval?: number;
}

export const PremiumCarousel = ({ data, autoPlayInterval = 5000 }: PremiumCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Core navigation logic
  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Safety check for bounds
    if (index < 0 || index >= data.length) return;
    
    setCurrentIndex(index);
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth'
    });
  }, [data.length]);

  const slideNext = useCallback(() => {
    if (currentIndex === data.length - 1) {
      scrollTo(0); // Rewind Loop
    } else {
      scrollTo(currentIndex + 1);
    }
  }, [currentIndex, data.length, scrollTo]);

  const slidePrev = useCallback(() => {
    if (currentIndex === 0) {
      scrollTo(data.length - 1);
    } else {
      scrollTo(currentIndex - 1);
    }
  }, [currentIndex, data.length, scrollTo]);

  // Autoplay Logic
  useEffect(() => {
    if (isHovered || isDragging) return;
    
    const timer = setInterval(slideNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, slideNext, autoPlayInterval]);

  // Handle native scroll updates to sync indicator when user swipes on mobile
  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== currentIndex && index >= 0 && index < data.length) {
      setCurrentIndex(index);
    }
  };

  // Mouse Drag Logic Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    
    // Snap to closest slide after drag ends
    const container = containerRef.current;
    const closestIndex = Math.round(container.scrollLeft / container.clientWidth);
    scrollTo(closestIndex);
  };

  if (!data?.length) return null;

  return (
    <div 
      className="relative w-full h-[87vh] md:h-[87vh] 2xl:h-[87vh] overflow-hidden group bg-[#1C140D]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); handleMouseUpOrLeave(); }}
      onMouseUp={handleMouseUpOrLeave}
    >
      {/* Slides Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={cn(
          "flex w-full h-full overflow-x-auto hide-scrollbar",
          isDragging ? "snap-none cursor-grabbing" : "snap-x snap-mandatory cursor-grab scroll-smooth"
        )}
      >
        {data.map((item, index) => (
          <div 
            key={item.id}
            className="flex-none w-full h-full snap-start relative transform transition-transform duration-500 ease-out"
          >
            {/* Image Component with Object Fit Cover */}
            <div className="absolute inset-0 z-0">
              <img 
                src={item.image} 
                alt={item.alt} 
                style={{ objectPosition: item.objectPosition || 'center center' }}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Gradient Overlay for Text Readability: Only at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 lg:px-24 container max-w-7xl mx-auto pointer-events-none">
              <div className={cn(
                "max-w-3xl transform transition-all duration-1000",
                currentIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {item.badge && (
                  <Typography variant="badge" className="text-white border-white/30 bg-white/10 mb-4 inline-block">
                    {item.badge}
                  </Typography>
                )}
                <Typography variant="h1" className="text-white mb-2 md:mb-4 drop-shadow-sm">
                  {item.title}
                </Typography>
                {(item.subtitle || item.description) && (
                  <div className="flex flex-col gap-2 relative">
                    {item.subtitle && (
                      <Typography variant="h3" className="text-[#C8873A] font-serif italic text-xl md:text-2xl">
                        {item.subtitle}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography variant="body" className="text-[#EBE0CF] font-light max-w-2xl text-base md:text-lg">
                        {item.description}
                      </Typography>
                    )}
                  </div>
                )}
                {item.ctaLabel && (
                  <button className="mt-8 px-8 py-3 bg-[#C8873A] text-white rounded-full font-medium hover:bg-[#A06828] transition-colors pointer-events-auto">
                    {item.ctaLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop Glassmorphism) */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4 md:px-8 pointer-events-none z-20">
        <button 
          onClick={slidePrev}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C8873A]/80 hover:scale-105 disabled:opacity-30"
          aria-label="Previous Slide"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 md:px-8 pointer-events-none z-20">
        <button 
          onClick={slideNext}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C8873A]/80 hover:scale-105 disabled:opacity-30"
          aria-label="Next Slide"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Indicator Component (System-level minimal) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-[#C8873A] transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
        />
      </div>

      {/* Minimalist Mobile Dots Tracking (Optional fallback for strong mobile UX) */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20 md:hidden pointer-events-none">
        {data.map((_, idx) => (
          <div 
            key={idx} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentIndex === idx ? "w-6 bg-[#C8873A]" : "w-1.5 bg-white/50"
            )}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
