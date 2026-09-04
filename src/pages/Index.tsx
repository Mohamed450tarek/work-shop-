import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import BestSellerSection from "../components/content/bestselar";
import BigOfferSection from "../components/content/bigoffer";
import SeasonOfferCard from "../components/content/cardoffer";
import OurCollection from "../components/content/collection";
import DarkProductsSection from "../components/content/darkproduct";
import CategoryGrid from "../components/content/catigorygrade";
 
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <BigOfferSection />
        <FiftyFiftySection />
        <CategoryGrid />
        <ProductCarousel />
        <BestSellerSection />
         
        <SeasonOfferCard />
        <OurCollection />
        <DarkProductsSection />
        <LargeHero />
        <OneThirdTwoThirdsSection />
        <EditorialSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
