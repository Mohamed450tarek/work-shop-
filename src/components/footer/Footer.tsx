const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <h2 className="text-xl font-medium mb-0">  <img 
              src="/newgate.svg" 
              alt="Linea Jewelry Inc" 
              className="h-40 w-auto"
            /></h2>
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Premium sports clothing designed for performance and style
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-black/70">
              <div>
                <p className="font-normal text-black mb-1">Visit Us</p>
                <p>456 Sports Avenue</p>
                <p>Los Angeles, CA 90001</p>
              </div>
              <div>
                <p className="font-normal text-black mb-1 mt-3">Contact</p>
                <p>+1 (310) 555-0123</p>
                <p>hello@newgate.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="/category/new-in" className="text-sm font-light text-black/70 hover:text-black transition-colors">New In</a></li>
                <li><a href="/category/tops" className="text-sm font-light text-black/70 hover:text-black transition-colors">Tops</a></li>
                <li><a href="/category/bottoms" className="text-sm font-light text-black/70 hover:text-black transition-colors">Bottoms</a></li>
                <li><a href="/category/outerwear" className="text-sm font-light text-black/70 hover:text-black transition-colors">Outerwear</a></li>
                <li><a href="/category/footwear" className="text-sm font-light text-black/70 hover:text-black transition-colors">Footwear</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/about/size-guide" className="text-sm font-light text-black/70 hover:text-black transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Care Instructions</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Returns</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shipping</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">TikTok</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2024 New Gate. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;