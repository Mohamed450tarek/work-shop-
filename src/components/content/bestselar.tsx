import { Link } from "react-router-dom";
import runningShoes from "@/assets/running-shoes.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";

const bestSellers = [
  {
    id: 1,
    name: "CloudRun Sneakers",
    price: "$145",
    image: runningShoes,
    link: "/product/1",
  },
  {
    id: 2,
    name: "Training Hoodie",
    price: "$89",
    image: trainingHoodie,
    link: "/product/2",
  },
];

const BestSellerSection = () => {
  return (
    <section className="w-full py-24 px-6 flex flex-col items-center gap-24">

      {bestSellers.map((product, index) => (
        <div
          key={product.id}
          className={`w-full flex ${index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
        >
          {/* CARD */}
          <div className="w-[70%] group">
            {/* IMAGE */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* INFO */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-light tracking-wide">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.price}
                </p>
              </div>

              <Link
                to={product.link}
                className="text-sm font-medium tracking-wide
                border-b border-black pb-1 hover:opacity-70 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}

    </section>
  );
};

export default BestSellerSection;
