import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import collectionRack from "@/assets/collection-rack.jpg";
import lifestyleWorkout from "@/assets/lifestyle-workout.jpg";
import { useTranslation } from "react-i18next";
const FiftyFiftySection = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation();

  const slides = [
    {
      image: collectionRack,
      title: t("Essential Tops"),
      description: "Performance-driven designs for every workout",
      link: "/products",
    },
    {
      image: lifestyleWorkout,
      title: t('premium_craft_supplies'),
      description: "Built for movement, designed for style",
      link: "/category/bottoms",
    },
  ];

  // auto pagination every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);





  return (
    <section className="w-[98%] top-0 mb-5 mt-5 mx-auto">
      <div className="relative w-full h-[100vh] overflow-hidden rounded-lg">

        {/* Slides */}
        {slides.map((slide, index) => (
          <Link
            to={slide.link}
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white max-w-xl px-6">
                <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-4">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base font-light opacity-90">
                  {slide.description}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                ${index === current ? "bg-white scale-110" : "bg-white/50"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;
