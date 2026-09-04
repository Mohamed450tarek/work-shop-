import React from "react";
import { Link } from "react-router-dom";

// Placeholder images - replace with actual imports in a real project
 import runningShoes from "@/assets/earrings-collection.png";
import trainingHoodie from "@/assets/organic-earring.png";
import runningJacket from "@/assets/collection-rack.jpg";


// --- Data Definition ---
const categories = [
  { 
    name: "women collection", 
    link: "#", 
    image: runningShoes, 
    bgColor: "bg-amber-100", 
    heightClass: "h-96 md:h-[400px]",
    spanClass: "md:col-span-1"
  },
  { 
    name: "home collection", 
    link: "#", 
    image: trainingHoodie, 
    bgColor: "bg-pink-200", 
    heightClass: "h-96 md:h-[500px]",
    spanClass: "md:col-span-1"
  },
  { 
    name: "man collection", 
    link: "#", 
    image: runningJacket, 
    bgColor: "bg-yellow-200", 
    heightClass: "h-96 md:h-[400px]",
    spanClass: "md:col-span-1"
  },
  { 
    name: "moukely collection", 
    link: "#", 
    image:  runningShoes, 
    bgColor: "bg-gray-200", 
    heightClass: "h-96 md:h-[500px]",
    spanClass: "md:col-span-1"
  },
  { 
    name: "women sports collection", 
    link: "#", 
    image: runningJacket, 
    bgColor: "bg-white", 
    heightClass: "h-96 md:h-[350px]",
    spanClass: "md:col-span-1"
  },
  { 
    name: "jacket collection", 
    link: "#", 
    image: runningShoes , 
    bgColor: "bg-blue-200", 
    heightClass: "h-96 md:h-[450px]",
    spanClass: "md:col-span-1"
  },
];

// --- Reusable Category Card Component ---
const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={category.link} 
      className={`group relative overflow-hidden block shadow-lg hover:shadow-xl transition-shadow duration-300 ${category.heightClass} ${category.spanClass}`}
    >
      {/* Image Container with Pastel Background */}
      <div className={`w-full h-full ${category.bgColor} flex items-center justify-center`}>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Category Name Overlay (Semi-transparent) */}
      <div className="absolute bottom-0 left-0 right-0 p-4  bg-white-10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/300">
        <p className="text-sm font-medium font-serif  bg-transparent uppercase tracking-wider text-gray-800  hover:text-red-800 ">
          {category.name}
        </p>
      </div>
    </Link>
  );
};

// --- Main Component ---
const CategoryGrid = () => {
  // Main background color from the image
  const colorCream = "#FAF7F5"; 
  // Title highlight color from the image
  const colorPinkHighlight = "#f7e4e4"; 

  return (
    <section 
      className="w-full h-full  top-0  py-16 md:py-24" 
      style={{ backgroundColor: colorCream }}
    >
      <div className="container mx-auto px-4">
        
        {/* Section Title           font-serif  */    }
        <div className="text-center mb-12 md:mb-16">   
          <h2 className="inline-block text-xl md:text-2xl font-macondo  uppercase tracking-widest text-gray-800 relative px-6 py-2">
            exclusive collection
            {/* Subtle Pink Highlight Circle */}
            <span 
              className="absolute inset-0 rounded-full -z-10" 
              style={{ backgroundColor: colorPinkHighlight }}
            />
          </h2>
        </div>

        {/* Category Grid - Using a custom grid to mimic the staggered layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Item 1, 3, 5 in the first column of the 3-column layout */}
          <div className="col-span-1 flex flex-col gap-6 md:gap-8">
            <CategoryCard category={categories[0]} />
            <CategoryCard category={categories[3]} />
          </div>

          {/* Item 2, 4 in the second column of the 3-column layout */}
          <div className="col-span-1 flex flex-col gap-6 md:gap-8 pt-0 md:pt-16">
            <CategoryCard category={categories[1]} />
            <CategoryCard category={categories[4]} />
          </div>

          {/* Item 6 in the third column of the 3-column layout */}
          <div className="col-span-1 flex flex-col gap-6 md:gap-8 pt-0 md:pt-8">
            <CategoryCard category={categories[2]} />
            <CategoryCard category={categories[5]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
