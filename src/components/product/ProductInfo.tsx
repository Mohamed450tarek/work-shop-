 import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/usecardstore";
import { useAuthStore } from "@/stores/useAuthStore";  
import { toast } from "sonner";

interface ProductInfoProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    priceAfterDiscount?: number;
    quantity: number;
    colors?: string[];
    category?: {
      _id: string;
      name: string;
    };
    brand?: {
      _id: string;
      name: string;
    };
    ratingsAverage?: number;
    ratingsQuantity?: number;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addToCart, isLoading } = useCartStore();
  const { authUser } = useAuthStore();  
  const navigate = useNavigate();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  // Set default color if available
  useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors, selectedColor]);

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (!authUser) {
      toast.error("You need to login first");
      navigate("/login", { state: { from: location.pathname } });  
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id, selectedColor || undefined);
      }
      setQuantity(1);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const finalPrice = product.priceAfterDiscount || product.price;
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  // Stock Line Logic
  const maxStock = 100;
  const stockPercentage = Math.min((product.quantity / maxStock) * 100, 100);
  const isLowStock = product.quantity > 0 && product.quantity <= 10;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/category/${product.category?._id}`}>
                  {product.category?.name || "Category"}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-light text-muted-foreground">{product.category?.name}</p>
          <h1 className="text-2xl font-light">{product.title}</h1>
        </div>
        <div className="text-right">
          {hasDiscount && <p className="text-sm line-through text-muted-foreground">EGP{product.price.toLocaleString()}</p>}
          <p className="text-xl">EGP{finalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Stock Availability Line */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-light text-foreground">Availability</span>
          <span className={`font-medium ${product.quantity === 0 ? "text-red-500" : isLowStock ? "text-orange-500" : "text-green-600"}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
              product.quantity === 0 
                ? "bg-transparent" 
                : isLowStock 
                  ? "bg-orange-500" 
                  : "bg-green-600"
            }`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex gap-2 items-center">
          {product.colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-foreground" : "border-border"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span>Quantity</span>
        <div className="flex items-center border">
          <Button variant="ghost" onClick={decrementQuantity} disabled={isAdding || isLoading}>
            <Minus size={14} />
          </Button>
          <span className="px-4">{quantity}</span>
          <Button variant="ghost" onClick={incrementQuantity} disabled={quantity >= product.quantity || isAdding || isLoading}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Add to Cart */}
      <Button
        className="w-full h-12 rounded-none flex items-center justify-center gap-2"
        onClick={handleAddToCart}
        disabled={product.quantity === 0 || isAdding || isLoading}
      >
        {isAdding ? "Adding..." : <><ShoppingBag className="w-4 h-4" /> Add to Bag</>}
      </Button>
    </div>
  );
};

export default ProductInfo;
