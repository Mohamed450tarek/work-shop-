 import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";

const Category = () => {
  const { category, subcategory } = useParams<{
    category?: string;
    subcategory?: string;
  }>();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({});
  const [itemCount, setItemCount] = useState(0);

  const getDisplayTitle = () => {
    if (subcategory) return `${category} - ${subcategory}`;
    return category || "All Products";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <CategoryHeader category={getDisplayTitle()} />

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={itemCount}
          onSortChange={setSortBy}
          onFilterChange={setFilters}
        />

        <ProductGrid
          category={category}
          subcategory={subcategory}  
          sortBy={sortBy}
          filters={filters}
          onItemCountUpdate={setItemCount}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Category;
