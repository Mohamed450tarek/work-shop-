 import { useEffect } from "react";
import { X, Minus, Plus, ShoppingBag as BagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/usecardstore";

interface ShoppingBagProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFavorites?: () => void;
}

const ShoppingBag = ({ isOpen, onClose, onViewFavorites }: ShoppingBagProps) => {
  const {
    cartItems,
    totalCartPrice,
    totalPriceAfterDiscount,
    numOfCartItems,
    isLoading,
    getCart,
    updateCartItemQuantity,
    removeCartItem,
  } = useCartStore();

  // Load cart when component opens
  useEffect(() => {
    if (isOpen) {
      getCart().catch(() => {
        // Silently handle error if no cart exists
      });
    }
  }, [isOpen, getCart]);

  if (!isOpen) return null;

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      // Remove item if quantity would be 0
      await removeCartItem(itemId);
    } else {
      await updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const finalTotal = totalPriceAfterDiscount || totalCartPrice;

  return (
    <div className="fixed inset-0 z-50 h-screen">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 h-screen"
        onClick={onClose}
      />
      
      {/* Off-canvas panel */}
      <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-light text-foreground">
            Shopping Bag {numOfCartItems > 0 && `(${numOfCartItems})`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Mobile favorites toggle - only show on mobile */}
          {onViewFavorites && (
            <div className="md:hidden mb-6 pb-6 border-b border-border">
              <button
                onClick={onViewFavorites}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-lg text-nav-foreground hover:text-nav-hover hover:border-nav-hover transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span className="text-sm font-light">View Favorites</span>
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && !cartItems.length ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <BagIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
              <p className="text-muted-foreground text-sm text-center">
                Your shopping bag is empty.<br />
                Continue shopping to add items to your bag.
              </p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.imageCover || '/placeholder.jpg'} 
                        alt={item.product?.title || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-light text-muted-foreground truncate">
                            Product
                          </p>
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {item.product?.title || 'Product'}
                          </h3>
                          {item.color && (
                            <div className="flex items-center gap-1 mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-border"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-xs text-muted-foreground">{item.color}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-light text-foreground whitespace-nowrap">
                          EGP{item.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                            disabled={isLoading}
                            className="p-2 hover:bg-muted/50 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-2 text-sm font-light min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                            disabled={isLoading}
                            className="p-2 hover:bg-muted/50 transition-colors disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Item subtotal */}
                        <p className="text-xs text-muted-foreground">
                          EGP{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Subtotal and checkout */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-light text-foreground">Subtotal</span>
                    <span className="text-sm font-medium text-foreground">
                      EGP{totalCartPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  {totalPriceAfterDiscount && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm font-light">After Discount</span>
                      <span className="text-sm font-medium">
                        EGP{parseFloat(totalPriceAfterDiscount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                
                <Button 
                  asChild 
                  className="w-full rounded-none" 
                  size="lg"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <Link to="/checkout">
                    View Cart & Checkout
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full rounded-none" 
                  size="lg"
                  onClick={onClose}
                  asChild
                >
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingBag;