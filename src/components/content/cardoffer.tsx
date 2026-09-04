import { Link } from "react-router-dom";

import runningJacket from "@/assets/running-jacket.jpg";
import runningShorts from "@/assets/running-shorts.jpg";
import runningShoes from "@/assets/running-shoes.jpg";
import leggings from "@/assets/leggings.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";

const offerProducts = [
  {
    id: 1,
    name: "Pro Running Jacket",
    oldPrice: "$160",
    newPrice: "$129",
    image: runningJacket,
  },
  {
    id: 2,
    name: "Performance Shorts",
    oldPrice: "$75",
    newPrice: "$59",
    image: runningShorts,
  },
  {
    id: 3,
    name: "CloudRun Sneakers",
    oldPrice: "$180",
    newPrice: "$145",
    image: runningShoes,
  },
  {
    id: 4,
    name: "Flex Leggings",
    oldPrice: "$95",
    newPrice: "$79",
    image: leggings,
  },
  {
    id: 5,
    name: "Training Hoodie",
    oldPrice: "$110",
    newPrice: "$89",
    image: trainingHoodie,
  },
];

const SeasonOfferCard = () => {
  return (
    <section className="w-full px-6 py-24">
      <div className="max-w-7xl mx-auto border border-black/10 rounded-3xl p-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Offer of the Season
          </p>

          <div className="flex items-center gap-4 mt-3">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">
              Season Choice
            </h2>
            <span className="text-sm font-medium text-red-600">
              20% OFF
            </span>
          </div>

          {/* Red Line */}
          <div className="w-16 h-[2px] bg-red-600 mt-4" />
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {offerProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative"
            >
              {/* Ribbon */}
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                20% OFF
              </div>

              {/* Image */}
              <div className="aspect-square overflow-hidden rounded-xl bg-muted/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="mt-3 text-center">
                <h3 className="text-sm font-light tracking-wide">
                  {product.name}
                </h3>
                <div className="flex justify-center items-center gap-2 mt-1">
                  <span className="text-xs text-red-600 line-through">
                    {product.oldPrice}
                  </span>
                  <span className="text-sm font-medium">
                    {product.newPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SeasonOfferCard;
