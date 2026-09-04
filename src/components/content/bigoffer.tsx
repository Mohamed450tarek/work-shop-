 import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// Assuming these assets are available
import runningShoes from "@/assets/running-shoes.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import runningJacket from "@/assets/running-jacket.jpg";

// --- Data Definition ---
const showcaseItems = [
  {
    id: 1,
    title: "LIMITED EDITION",
    subtitle: "Elegant Comfort",
    description: "FOR YOUR HOME",
    image: runningShoes,
    link: "/category/kids-linen",
    ctaText: "SHOP HOME GOODS",
    insetImage: trainingHoodie, 
  },
  {
    id: 2,
    title: "LIMITED EDITION",
    subtitle: "Elegant Comfort",
    description: "FOR YOUR HOME",
    image: trainingHoodie,
    link: "/category/home-goods",
    ctaText: "SHOP HOME GOODS",
    insetImage: runningJacket,
  },
  {
    id: 3,
    title: "NEW ARRIVALS",
    subtitle: "Premium Quality",
    description: "FOR EVERY SEASON",
    image: runningJacket,
    link: "/category/new-arrivals",
    ctaText: "VIEW COLLECTION",
    insetImage: runningShoes,
  },
];

// --- Main Component ---
const  BigOfferSection = () => {
  const [current, setCurrent] = useState(0);
  const totalItems = showcaseItems.length;

  // Logic for next slide
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  // Auto pagination every 6s
  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const currentItem = showcaseItems[current];

  // --- Color Palette based on the image ---
  const colorMint = "#DFF0E9"; // Light pastel green
  const colorCream = "#FAF7F5"; // Light off-white background
  const colorMaroon = "#B03A3A"; // Deep red/maroon for CTA

  return (
    <section 
      className="w-full min-h-[80vh] py-12 md:py-0 flex items-center justify-center" 
      style={{ backgroundColor: colorCream }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Content Block */}
          <div 
            className="md:col-span-7 p-8 md:p-16 h-full min-h-[500px] flex flex-col justify-center relative transition-all duration-700 ease-in-out"
            style={{ backgroundColor: colorMint }}
          >
            <div className="max-w-lg">
              {/* Text Content - Using font-serif for the elegant look */}
              <h2 className="text-4xl md:text-5xl font-serif leading-tight text-gray-800 transition-opacity duration-700 delay-300">
                {currentItem.title}
                <br />
                <span className="italic font-serif">
                  {currentItem.subtitle}
                </span>
                <br />
                {currentItem.description}
              </h2>

              {/* CTA Button */}
              <Link
                to={currentItem.link}
                className="inline-flex items-center mt-10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: colorMaroon }}
              >
                {currentItem.ctaText}
                <span className="ml-2 text-lg">›</span>
              </Link>
            </div>
            
            {/* Slide Indicator (Pagination) */}
            <div className="absolute bottom-8 left-16 flex gap-4 text-gray-800">
              {showcaseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`text-lg font-serif transition-all duration-300 relative
                    ${index === current ? "font-bold" : "opacity-50 hover:opacity-80"}
                  `}
                >
                  {/* Number with leading zero */}
                  {String(index + 1).padStart(2, '0')}
                  {/* Active Circle */}
                  {index === current && (
                    <span className="absolute -inset-1 border border-gray-800 rounded-full w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Image Block */}
          <div className="md:col-span-5 relative h-full min-h-[500px] flex items-center justify-center">
            {/* Main Image - Styled to overlap the content block */}
            <img
              key={currentItem.id + "-main"} // Key change forces re-render for transition effect
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover object-center shadow-xl -translate-x-1/4 md:-translate-x-1/3 transition-transform duration-700 ease-in-out"
              style={{ 
                width: '120%', // Make it wider to cover the overlap area
                height: '80%', 
                maxHeight: '600px',
                objectFit: 'cover',
                zIndex: 10,
              }}
            />

            {/* Inset Image - Smaller, layered effect */}
            <img
              key={currentItem.id + "-inset"}
              src={currentItem.insetImage}
              alt="Inset detail"
              className="absolute top-1/2 right-0 bottom-0 shadow-2xl transition-opacity duration-700 delay-200"
              style={{ 
                width: '35%', 
                height: '35%', 
                objectFit: 'cover',
                zIndex: 20,
                transform: 'translate(0%, 20%)', // Position it outside the main image area
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BigOfferSection;
