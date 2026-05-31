import { siteData } from '../../config/siteData';
import type { GalleryItem } from '../../config/siteData';
import { PremiumCarousel } from '../ui/PremiumCarousel';

interface GallerySectionProps {
  data?: GalleryItem[];
}

export const GallerySection = ({ data = siteData.images.gallery }: GallerySectionProps) => {
  return (
    <section id="gallery" className="bg-[#1C140D] flex flex-col">
      <PremiumCarousel data={data} autoPlayInterval={6000} />
    </section>
  );
};
