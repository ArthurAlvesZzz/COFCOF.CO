import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toggleCart, items } = useCartStore();
  const location = useLocation();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past top
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine scroll direction for hiding/showing
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Cafés', href: '/cafes' },
    { label: 'Clube', href: '/assinatura' },
    { label: 'Empresas', href: '/empresas' },
    { label: 'Origem', href: '/origem' },
    { label: 'Onde encontrar', href: '/parceiros' },
    { label: 'Sobre', href: '/sobre' },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none transition-all duration-500",
          isVisible ? "top-4 opacity-100 translate-y-0" : "-top-24 opacity-0 -translate-y-10"
        )}
      >
        <nav 
          className={cn(
            "pointer-events-auto transition-all duration-300 w-full max-w-7xl",
            isScrolled ? "py-2" : "py-3",
            "bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full px-6 md:px-10 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white"
          )}
        >
          <div className="w-full flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl font-serif font-bold tracking-tight z-50 py-1">
              COFCOF<span className="text-cof-gold">.CO</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === link.href ? "text-cof-gold" : "text-white/80 hover:text-cof-gold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link to="/login" className="text-sm font-medium transition-colors flex items-center gap-2 text-white/80 hover:text-cof-gold">
                <User size={18} />
                Entrar
              </Link>
              <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full transition-colors hover:bg-white/10"
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-cof-gold text-cof-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <Link 
                to="/cafes" 
                className="bg-white text-cof-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-cof-gold transition-colors block"
              >
                Comprar
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-3 z-50">
              <button 
                onClick={toggleCart}
                className="relative p-2"
              >
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-cof-gold text-cof-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 pt-32 bg-[#1C1A17] text-white z-40 flex flex-col px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="hover:text-cof-gold">
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10 my-4" />
              <Link to="/login" className="hover:text-cof-gold flex items-center gap-3">
                <User size={24} />
                Minha Conta
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
