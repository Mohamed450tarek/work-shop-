import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

import OurStory from "./pages/about/OurStory";
import Sustainability from "./pages/about/Sustainability";
import SizeGuide from "./pages/about/SizeGuide";
import CustomerCare from "./pages/about/CustomerCare";
import StoreLocator from "./pages/about/StoreLocator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";

import { useAuthStore } from "./stores/useAuthStore";

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

 useEffect(() => {
  checkAuth();
}, []);


  if (isCheckingAuth) {
    return <div>Loading application...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/products" element={<Category/>} />
            <Route path="/category/:category/:subcategory" element={<Category />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/about/our-story" element={<OurStory />} />
            <Route path="/about/sustainability" element={<Sustainability />} />
            <Route path="/about/size-guide" element={<SizeGuide />} />
            <Route path="/about/customer-care" element={<CustomerCare />} />
            <Route path="/about/store-locator" element={<StoreLocator />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Auth Pages */}
            <Route
              path="/login"
              element=  {!authUser ? <LoginPage />  : <Navigate to={"/"}/>}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage />   : <Navigate to={"/"}/>}
            />

            {/* 🔐 Protected Routes */}
            <Route
              path="/checkout"
              element={
               
                  <Checkout />
                
              }
            />

            <Route
              path="/privacy-policy"
              element={
                <ProtectedRoute>
                  <PrivacyPolicy />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
