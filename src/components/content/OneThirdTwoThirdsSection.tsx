 import React from "react";
import { Link } from "react-router-dom";

import runningShoes from "@/assets/running-shoes.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import runningJacket from "@/assets/running-jacket.jpg";

// Placeholder data for the two featured products
const featuredProducts = [
  {
    id: 1,
    name: "Signature Running Shoe",
    price: 189.99,
    image: runningShoes,
    size: "large", // Corresponds to 60% width
    description: "The ultimate in comfort and performance. Engineered for speed and endurance.",
  },
  {
    id: 2,
    name: "Limited Edition Hoodie",
    price: 99.00,
    image: trainingHoodie,
    size: "small", // Corresponds to 30% width
    description: "Soft, breathable cotton blend with a minimalist design. Perfect for post-workout.",
  },
];

// --- Product Card Component ---
const ProductCard = ({ product }) => {
  const isLarge = product.size === "large";
  
  // Dynamic classes for 60% and 30% width on desktop, full width on mobile
  const widthClass = isLarge ? "md:w-[60%]" : "md:w-[30%]";
  const heightClass = isLarge ? "h-[500px] md:h-[600px]" : "h-[400px] md:h-[500px]";

  return (
    <div 
      className={`relative w-full ${widthClass} ${heightClass} mx-auto group overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-in-out`}
      style={{ 
        // Modern Border Effect: subtle rounded corners and a slight lift on hover
        borderRadius: '16px', 
        border: '1px solid #e5e7eb', // Light gray border
      }}
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Content Overlay - Always visible for product info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white mb-1">
          {product.name}
        </h3>
        <p className="text-lg text-white/80 mb-4">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Add to Cart Button - Hover to Reveal Effect */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:bg-black/40">
        <Link
          to={`/product/${product.id}/add-to-cart`}
          className="px-8 py-4 text-base font-bold uppercase tracking-wider text-white bg-red-600 rounded-full shadow-xl transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-red-700"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
};

// --- Main Component ---
const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Featured Drops
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Explore our two most exclusive products of the season.
          </p>
        </div>

        {/* Dual Product Layout - Centered and Spaced */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          {/* The products are intentionally rendered in this order to achieve the desired visual balance */}
          <ProductCard product={featuredProducts[1]} /> {/* Small (30%) */}
          <ProductCard product={featuredProducts[0]} /> {/* Large (60%) */}
        </div>
      </div>
    </section>
  );
};

export default  OneThirdTwoThirdsSection;
