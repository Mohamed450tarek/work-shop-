 import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import { useProductStore } from "../../stores/useProductStore";

interface ProductGridProps {
  category?: string;
  subcategory?: string;
  sortBy?: string;
  filters?: any;
  limit?: number;
  onItemCountUpdate?: (count: number) => void;
}

const ProductGrid = ({
  category,
  subcategory,
  sortBy = "featured",
  limit,
  onItemCountUpdate
}: ProductGridProps) => {
  const { products, isLoading, error, getProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 24;

  useEffect(() => {
    if (category) {
      getProducts({ category });
    } else {
      getProducts();
    }
  }, [category, getProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory]);
  const filteredProducts = useMemo(() => {
    if (!subcategory) return products;

    return products.filter((product: any) =>
      product.subcategories?.some(
        (sub: any) =>
          sub?.slug === subcategory || sub?.name === subcategory
      )
    );
  }, [products, subcategory]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.priceAfterDiscount || a.price;
    const priceB = b.priceAfterDiscount || b.price;

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const indexOfLast = currentPage * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfLast - itemsPerPage,
    indexOfLast
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  useEffect(() => {
    onItemCountUpdate?.(sortedProducts.length);
  }, [sortedProducts.length, onItemCountUpdate]);

  if (isLoading) {
    return <div className="px-6 py-16 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="px-6 py-16 text-center">{error}</div>;
  }

  if (currentProducts.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product: any) => {
          const mainImage = product.imageCover?.secure_url;
          const hoverImage = product.images?.[0]?.secure_url || mainImage;
          const finalPrice =
            product.priceAfterDiscount || product.price;

          return (
            <Link key={product._id} to={`/product/${product._id}`}>
              <Card className="border-none shadow-none bg-transparent group">
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 relative overflow-hidden">
                    <img
                      src={mainImage}
                      className="w-full h-full object-cover group-hover:opacity-0 transition"
                    />
                    {hoverImage && (
                      <img
                        src={hoverImage}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition"
                      />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {product.category?.name}
                  </p>

                  <div className="flex justify-between items-center">
                    <h3 className="text-sm truncate">{product.title}</h3>
                    <p className="text-sm">€{finalPrice}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default ProductGrid;
