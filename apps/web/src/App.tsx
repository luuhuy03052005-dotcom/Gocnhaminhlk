import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingButtons } from './components/ui/FloatingButtons';
import { HeroSection } from './components/sections/HeroSection';
import { HighlightSlider } from './components/sections/HighlightSlider';
import { IntroSection } from './components/sections/IntroSection';
import { MenuSection } from './components/sections/MenuSection';
import { GokaSection } from './components/sections/GokaSection';
import { GallerySection } from './components/sections/GallerySection';
import { PromoSection } from './components/sections/PromoSection';
import { LocationContactSection } from './components/sections/LocationContactSection';
import { ApiStatusNotice } from './components/ui/ApiStatusNotice';
import { usePublicContent } from './hooks/usePublicContent';

function App() {
  const publicContent = usePublicContent();

  return (
    <div className="font-sans antialiased text-[#2C2017] bg-[#FDF6EE] scroll-smooth">
      <Header />
      <ApiStatusNotice message={publicContent.notice} />
      <main>
        <HeroSection />
        <HighlightSlider items={publicContent.highlightItems} />
        <GallerySection data={publicContent.galleryItems} />
        <IntroSection />
        <MenuSection categories={publicContent.menuCategories} />
        <GokaSection />
        <PromoSection />
        <LocationContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default App;
