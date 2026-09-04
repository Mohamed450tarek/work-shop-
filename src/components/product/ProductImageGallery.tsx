 import { useState, useRef, useMemo } from "react";
import ImageZoom from "./ImageZoom";

interface ProductImageGalleryProps {
  product: {
    imageCover?: {
      secure_url: string;
      public_id: string;
    };
    images?: Array<{
      secure_url: string;
      public_id: string;
    }>;
    title?: string;
  };
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // إنشاء مصفوفة الصور من البيانات
  const productImages = useMemo(() => {
    const images: string[] = [];
    
    // إضافة الصورة الرئيسية
    if (product.imageCover?.secure_url) {
      images.push(product.imageCover.secure_url);
    }
    
    // إضافة باقي الصور
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img.secure_url) {
          images.push(img.secure_url);
        }
      });
    }
    
    return images;
  }, [product]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleImageClick = (index: number) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (productImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center">
        <p className="text-sm font-light text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop: Vertical scrolling gallery (1024px and above) */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          {productImages.map((image, index) => (
            <div 
              key={index} 
              className="w-full aspect-square overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`${product.title || 'Product'} view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tablet/Mobile: Image slider (below 1024px) */}
      <div className="lg:hidden">
        <div className="relative">
          <div 
            className="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y"
            onClick={() => handleImageClick(currentImageIndex)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={productImages[currentImageIndex]}
              alt={`${product.title || 'Product'} view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </div>
          
          {/* Dots indicator */}
          {productImages.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-foreground' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={productImages}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;