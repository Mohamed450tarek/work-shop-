import { Link } from "react-router-dom";

import collectionRack from "@/assets/collection-rack.jpg";
import lifestyleWorkout from "@/assets/lifestyle-workout.jpg";
import runningShoes from "@/assets/running-shoes.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import leggings from "@/assets/leggings.jpg";

const collections = [
  { id: 1, name: "Tops Collection", image: collectionRack, link: "/category/tops" },
  { id: 2, name: "Bottoms Collection", image: leggings, link: "/category/bottoms" },
  { id: 3, name: "Shoes Collection", image: runningShoes, link: "/category/shoes" },
  { id: 4, name: "Hoodies & Jackets", image: trainingHoodie, link: "/category/hoodies" },
  { id: 5, name: "Workout Lifestyle", image: lifestyleWorkout, link: "/category/lifestyle" },
];

const OurCollection = () => {
  return (
    <section className="w-full py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide">
            Our Collection
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Explore our curated collections with modern style and resilience
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {collections.map((collection, index) => {

            // Random rotation for modern look
            const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-0"];
            const rotationClass = rotations[index % rotations.length];

            // Random shadow / hover
            const shadows = [
              "shadow-xl",
              "shadow-lg",
              "shadow-2xl",
              "shadow-none",
              "shadow-md"
            ];
            const shadowClass = shadows[index % shadows.length];

            return (
              <Link
                key={collection.id}
                to={collection.link}
                className={`group relative overflow-hidden rounded-3xl ${rotationClass} ${shadowClass} transition-transform duration-500 hover:scale-105`}
              >
                <div className="aspect-square">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl"></div>
                </div>

                {/* Label */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg md:text-xl font-medium tracking-wide drop-shadow-lg">
                    {collection.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default OurCollection;
