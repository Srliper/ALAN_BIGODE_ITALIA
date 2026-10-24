import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import QuickLinks from '@/components/QuickLinks';
import ScrollSequence from '@/components/ScrollSequence';
import ServicesSection from '@/components/ServicesSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import TeamSection from '@/components/TeamSection';
import ProductsSection from '@/components/ProductsSection';
import BookingSection from '@/components/BookingSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import IntroSplash from '@/components/IntroSplash';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <IntroSplash />
      <Navbar />
      <main>
        <HeroSection />
        <QuickLinks />
        <ServicesSection />
        <ScrollSequence />
        <GallerySection />
        <AboutSection />
        <TeamSection />
        <ProductsSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
