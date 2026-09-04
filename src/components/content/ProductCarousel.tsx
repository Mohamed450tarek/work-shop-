import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import runningJacket from "@/assets/running-jacket.jpg";
import runningShorts from "@/assets/running-shorts.jpg";
import runningShoes from "@/assets/running-shoes.jpg";
import leggings from "@/assets/leggings.jpg";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import sportsBra from "@/assets/sports-bra.jpg";
import joggers from "@/assets/joggers.jpg";
import performanceTee from "@/assets/performance-tee.jpg";

const products = [
  { id: 1, name: "Pro Running Jacket", category: "Outerwear", price: "$129", image: runningJacket },
  { id: 2, name: "Performance Shorts", category: "Bottoms", price: "$59", image: runningShorts },
  { id: 3, name: "CloudRun Sneakers", category: "Footwear", price: "$145", image: runningShoes },
  { id: 4, name: "Flex Leggings", category: "Bottoms", price: "$79", image: leggings },
  { id: 5, name: "Training Hoodie", category: "Tops", price: "$89", image: trainingHoodie },
  { id: 6, name: "Support Sports Bra", category: "Tops", price: "$49", image: sportsBra },
];

const ProductCarousel = () => {
  return (
    <section className="w-full mb-20 px-6 relative">
      <Carousel
        opts={{ align: "start" }}
        className="w-full"
      >
        {/* Pagination Arrows (LEFT focused) */}
        <CarouselPrevious className="-left-12 top-1/2" />
        <CarouselNext className="-right-6 top-1/2" />

        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-4"
            >
              <Card className="border-none bg-transparent group">
                <CardContent className="p-0">

                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Second Image */}
                    <img
                      src={product.category === "Bottoms" ? joggers : performanceTee}
                      alt="lifestyle"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Add to Cart */}
                    <button
                      className="absolute bottom-4 left-1/2 -translate-x-1/2
                      bg-white text-black text-xs font-medium px-4 py-2 rounded-full
                      opacity-0 group-hover:opacity-100 transition-all duration-300
                      hover:bg-black hover:text-white"
                    >
                      Add to Cart
                    </button>

                    {/* Badge */}
                    {(product.id === 1 || product.id === 3) && (
                      <span className="absolute top-3 left-3 text-xs tracking-wide text-black bg-white px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* TEXT */}
                  <Link to={`/product/${product.id}`}>
                    <div className="mt-4 space-y-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">
                          {product.name}
                        </h3>
                        <span className="text-sm font-light">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </Link>

                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
