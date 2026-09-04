import { useState } from "react";
import { Link } from "react-router-dom";

import runningShoes from "@/assets/running-shoes.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import runningJacket from "@/assets/running-jacket.jpg";
import leggings from "@/assets/leggings.jpg";
import performanceTee from "@/assets/performance-tee.jpg";

const darkProducts = [
  { id: 1, name: "CloudRun Sneakers", price: "$145", image: runningShoes },
  { id: 2, name: "Training Hoodie", price: "$89", image: trainingHoodie },
  { id: 3, name: "Pro Running Jacket", price: "$129", image: runningJacket },
  { id: 4, name: "Flex Leggings", price: "$79", image: leggings },
  { id: 5, name: "Performance Tee", price: "$49", image: performanceTee },
];

const DarkProductsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const visibleCount = 3;
  const maxIndex = darkProducts.length - visibleCount;

  const prev = () => setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const next = () => setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <section className="w-full py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide">
            Dark Collection
          </h2>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            Premium dark products with thunder vibe
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute left-0 z-10 text-white text-3xl opacity-70 hover:opacity-100 transition"
          >
            ‹
          </button>

          {/* Products Row */}
          <div className="flex overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
            >
              {darkProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group relative flex-shrink-0 w-1/3 px-2"
                >
                  {/* Ribbon */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    20% OFF
                  </div>

                  {/* Card with thunder glow */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-800 group-hover:shadow-[0_0_20px_#fef08a] transition-shadow duration-500">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Thunder effect overlay */}
                    <div className="absolute inset-0 pointer-events-none">

                      <button className="absolute bottom-1 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full shadow-lg scale-95 group-hover:scale-105 group-hover:shadow-[0_0_20px_#fef08a] transition-all duration-300">
                        Add to Cart
                      </button>
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent opacity-0 group-hover:opacity-50 animate-pulse-fast"></div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-3 text-center">
                    <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
                    <p className="text-sm text-gray-300">{product.price}</p>
                  </div>

                  {/* Add to Cart Button */}

                </Link>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute right-0 z-10 text-white text-3xl opacity-70 hover:opacity-100 transition"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default DarkProductsCarousel;
