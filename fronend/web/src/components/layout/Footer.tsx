export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand + short description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                TF
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">TaemFood</h3>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-xs">
              Delicious homemade-style meals delivered to your door — fast, fresh, and full of flavor.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:text-center">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3 text-gray-600">
              <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
              <a href="/menu" className="hover:text-orange-600 transition-colors">Menu</a>
              <a href="/cart" className="hover:text-orange-600 transition-colors">Cart</a>
              <a href="/orders" className="hover:text-orange-600 transition-colors">My Orders</a>
              <a href="/track" className="hover:text-orange-600 transition-colors">Track Order</a>
            </nav>
          </div>

          {/* Contact / Legal */}
          <div className="md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
              Get in Touch
            </h4>
            <div className="space-y-3 text-gray-600">
              <p>support@taemfood.com</p>
              <p>+1 (555) 123-4567</p>
              
              <div className="flex gap-5 mt-6 md:justify-end">
                <SocialIcon href="#" icon="twitter" />
                <SocialIcon href="#" icon="instagram" />
                <SocialIcon href="#" icon="facebook" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} TaemFood. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
              <a href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-gray-700 transition-colors">Cookies</a>
              <a href="/contact" className="hover:text-gray-700 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Small helper component (you can also use heroicons / lucide-react instead)
function SocialIcon({ href, icon }: { href: string; icon: string }) {
  const icons = {
    twitter: "M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.624-4.37 4.168 4.168 0 0 0-.566 2.1c0 1.45.738 2.731 1.86 3.481a4.137 4.137 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.17 4.17 0 0 1-1.888.07 4.182 4.182 0 0 0 3.902 2.9A8.39 8.39 0 0 1 2 19.185 11.812 11.812 0 0 0 13.29 24c15.572 0 24.096-12.902 24.096-24.096 0-.367-.008-.733-.025-1.095A17.2 17.2 0 0 0 30 5.656z",
    instagram: "...", // you can add real paths or use icon library
    facebook: "...",
  };

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-orange-600 transition-colors"
      aria-label={icon}
    >
      {/* You should ideally use an icon library like lucide-react / heroicons */}
      {/* This is just placeholder SVG path */}
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d={icons[icon as keyof typeof icons] || ""} />
      </svg>
    </a>
  );
}