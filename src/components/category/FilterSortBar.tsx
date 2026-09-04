 import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;

  onSortChange: (value: string) => void;
  onFilterChange: (filters: any) => void;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  onSortChange,
  onFilterChange,
}: FilterSortBarProps) => {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["men", "women", "bundles"];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
    });
    setFiltersOpen(false);
  };

  return (
    <section className="w-full px-6 mb-8 border-b border-border pb-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-light text-muted-foreground">
          {itemCount} items
        </p>

        <div className="flex items-center gap-4">
          {/* Filters */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="font-light">
                Filters
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 bg-background">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-lg font-light">
                  Filters
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-light mb-4">Category</h3>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label className="capitalize">{category}</Label>
                    </div>
                  ))}
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={applyFilters}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              onSortChange(value);
            }}
          >
            <SelectTrigger className="w-auto border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default FilterSortBar;
