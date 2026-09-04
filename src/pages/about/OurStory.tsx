import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader 
            title="Our Story" 
            subtitle="A journey of passion, performance, and innovation"
          />
          
          <ContentSection>
            <ImageTextBlock
              image="/founders.png"
              imageAlt="Company founders"
              title="Founded on Movement"
              content="New Gate was born from a shared vision of creating athletic wear that performs as hard as you do. Our founders, united by their passion for sports and sustainable practices, established the brand with a commitment to creating clothing that empowers athletes at every level — from first-timers to professionals."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="Our Heritage">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Performance Engineering</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every piece in our collection is meticulously designed using advanced fabric technologies and ergonomic patterns. We combine the latest in moisture-wicking, stretch, and breathability with timeless athletic aesthetics.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Sustainable Future</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe performance and sustainability can coexist seamlessly. Our commitment to recycled materials, ethical manufacturing, and responsible practices ensures that every piece you wear contributes to a healthier planet.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Our Values">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Excellence</h3>
                <p className="text-muted-foreground">
                  We pursue perfection in every stitch, from the initial design concept to the final quality check.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Performance</h3>
                <p className="text-muted-foreground">
                  Each garment is engineered to enhance your movement and support your athletic goals.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our materials and designs while honoring timeless athletic principles.
                </p>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OurStory;