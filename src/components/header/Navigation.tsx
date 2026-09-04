 import { ArrowRight, X, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShoppingBag from "./ShoppingBag";
import runningJacket from "@/assets/running-jacket.jpg";
import runningShortsImage from "@/assets/running-shorts.jpg";
import goo from "@/assets/circular-collection.png";
import earringsCollection from "@/assets/earrings-collection.png";
import trainingHoodie from "@/assets/training-hoodie.jpg";
import { useTranslation } from "../ui/translationtoggele";
import { useCartStore } from "@/stores/usecardstore";

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const { toggleLanguage, language } = useTranslation();
  
  // Get cart data from Zustand store
  const { numOfCartItems, getCart } = useCartStore();

  // Load cart on component mount
  useEffect(() => {
    getCart().catch(() => {
      // Silently handle error if no cart exists
    });
  }, [getCart]);

  const popularSearches = [
    "Running Gear",
    "Training Shorts", 
    "Performance Tops",
    "Sports Bras",
    "Athletic Joggers",
    "Workout Hoodies"
  ];
  
  const navItems = [
    { 
      name: "MEN", 
      href: "/category/men",
      category: "men",
      submenuItems: [
        { name: "Tops", subcategory: "tops" },
        { name: "Bottoms", subcategory: "bottoms" },
        { name: "Sports", subcategory: "sports" },
        { name: "Outerwear", subcategory: "outerwear" },
        { name: "Accessories", subcategory: "accessories" }
      ],
      images: [
        { src: runningJacket, alt: "Outerwear Collection", label: "Outerwear", subcategory: "outerwear" },
        { src: runningShortsImage, alt: "Bottoms Collection", label: "Bottoms", subcategory: "bottoms" }
      ]
    },
    { 
      name: "WOMEN", 
      href: "/category/women",
      category: "women",
      submenuItems: [
        { name: "Tops", subcategory: "tops" },
        { name: "Bottoms", subcategory: "bottoms" },
        { name: "Outerwear", subcategory: "outerwear" },
        { name: "Accessories", subcategory: "accessories" }
      ],
      images: [
        { src: goo, alt: "Outerwear Collection", label: "Outerwear", subcategory: "outerwear" },
        { src: earringsCollection, alt: "Bottoms Collection", label: "Bottoms", subcategory: "bottoms" }
      ]
    },
    { 
      name: "BUNDLES", 
      href: "/category/bundles",
      category: "bundles",
      submenuItems: [
        { name: "Tops", subcategory: "tops" },
        { name: "Bottoms", subcategory: "bottoms" },
        { name: "Outerwear", subcategory: "outerwear" },
        { name: "Accessories", subcategory: "accessories" },
        { name: "Sports", subcategory: "sports" },
      ],
      images: [
        { src: runningJacket, alt: "Outerwear Collection", label: "Outerwear", subcategory: "outerwear" },
        { src: runningShortsImage, alt: "Bottoms Collection", label: "Bottoms", subcategory: "bottoms" }
      ]
    },
    { 
      name: "New in", 
      href: "/category/new-in",
      submenuItems: [
        { name: "This Week's Arrivals", subcategory: "this-week" },
        { name: "Spring Collection", subcategory: "spring" },
        { name: "Performance Series", subcategory: "performance" },
        { name: "Limited Edition", subcategory: "limited" },
        { name: "Pre-Orders", subcategory: "pre-orders" }
      ],
      images: [
        { src: trainingHoodie, alt: "Training Hoodie", label: "Training Hoodie" },
        { src: runningJacket, alt: "Running Jacket", label: "Pro Running Jacket" }
      ]
    },
    { 
      name: "About", 
      href: "/about/our-story",
      submenuItems: [
        { name: "Our Story", href: "/about/our-story" },
        { name: "Sustainability", href: "/about/sustainability" },
        { name: "Size Guide", href: "/about/size-guide" },
        { name: "Customer Care", href: "/about/customer-care" },
        { name: "Store Locator", href: "/about/store-locator" }
      ],
      images: [
        { src: "/founders.png", alt: "Company Founders", label: "Read our story" }
      ]
    }
  ];

  return (
    <nav 
      className="relative" 
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile hamburger button */}
        <button
          className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 relative">
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'
            }`}></span>
          </div>
        </button>

        {/* Left navigation */}
        <div className="hidden font-bold lg:flex space-x-8 font-macondo">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="block">
            <img 
              src="/newgate.svg" 
              alt="Linea Jewelry Inc" 
              className="h-32 w-auto"
            />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          
          <button 
            className="hidden lg:block p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Favorites"
            onClick={() => setOffCanvasType('favorites')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          <button
            onClick={toggleLanguage}
            className="p-2 text-foreground hover:text-primary transition-colors active:scale-95"
            aria-label="Toggle language"
          >
            <Languages className="w-6 h-6" />
          </button>

          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
            aria-label="Shopping bag"
            onClick={() => setIsShoppingBagOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {numOfCartItems > 0 && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-black pointer-events-none">
                {numOfCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full width dropdown */}
      {activeDropdown && (
        <div 
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full">
              {/* Left side - Menu items */}
              <div className="flex-1">
                <ul className="space-y-2">
                  {navItems
                    .find(item => item.name === activeDropdown)
                    ?.submenuItems.map((subItem, index) => {
                      const parentItem = navItems.find(item => item.name === activeDropdown);
                      const linkTo = activeDropdown === "About" 
                        ? subItem.href 
                        : parentItem?.category 
                          ? `/category/${parentItem.category}/${subItem.subcategory}`
                          : `/category/${subItem.subcategory}`;
                      
                      return (
                        <li key={index}>
                          <Link 
                            to={linkTo}
                            className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>

              {/* Right side - Images */}
              <div className="flex space-x-6">
                {navItems
                  .find(item => item.name === activeDropdown)
                  ?.images.map((image, index) => {
                    const parentItem = navItems.find(item => item.name === activeDropdown);
                    let linkTo = "/";
                    
                    if (activeDropdown === "About") {
                      linkTo = "/about/our-story";
                    } else if (parentItem?.category && image.subcategory) {
                      linkTo = `/category/${parentItem.category}/${image.subcategory}`;
                    } else if (image.subcategory) {
                      linkTo = `/category/${image.subcategory}`;
                    }
                    
                    return (
                      <Link key={index} to={linkTo} className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                        />
                        <div className="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1">
                          <span>{image.label}</span>
                          <ArrowRight size={12} />
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for sports clothing..."
                    className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  <div className="mt-3 pl-4 space-y-2">
                    {item.submenuItems.map((subItem, subIndex) => {
                      const linkTo = item.name === "About" 
                        ? subItem.href 
                        : item.category 
                          ? `/category/${item.category}/${subItem.subcategory}`
                          : `/category/${subItem.subcategory}`;
                      
                      return (
                        <Link
                          key={subIndex}
                          to={linkTo}
                          className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Bag Drawer - Updated to use Zustand store */}
      <ShoppingBag
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        onViewFavorites={() => {
          setIsShoppingBagOpen(false);
          setOffCanvasType('favorites');
        }}
      />
        
      {/* Favorites Drawer */}
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-50 h-screen">
          <div 
            className="absolute inset-0 bg-black/50 h-screen"
            onClick={() => setOffCanvasType(null)}
          />
          
          <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
              <button
                onClick={() => setOffCanvasType(null)}
                className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-6">
                You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;