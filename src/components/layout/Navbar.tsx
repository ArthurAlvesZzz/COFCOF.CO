import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { BrandLogo } from '../brand/BrandLogo';

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
    { label: 'Onde encontrar', href: '/parceiros' },
    { label: 'Origem', href: '/origem' },
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
            "pointer-events-auto transition-all duration-300 w-full max-w-7xl flex justify-between items-center text-white",
            isScrolled ? "h-14 shadow-sm" : "h-16 shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
            "bg-[#160F0A]/90 backdrop-blur-md border border-[#c9a263]/10 rounded-full px-5 md:px-8"
          )}
        >
          <div className="w-full flex items-center justify-between h-full">
            <div className="z-50 shrink-0">
              <BrandLogo size="nav" />
            </div>

            {/* Desktop Nav - lg breakpoint for showing all links */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.href} 
                    to={link.href}
                    className={cn(
                      "relative px-3 py-2 text-[13px] font-medium transition-all duration-200 group flex items-center",
                      isActive ? "text-[#c9a263]" : "text-[#a3a3a3] hover:text-white"
                    )}
                  >
                    {link.label}
                    {/* Active/Hover Indicator */}
                    <span className={cn(
                      "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c9a263] transition-all duration-200",
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-50"
                    )} />
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              <Link 
                to="/login" 
                className="text-[13px] font-medium transition-colors flex items-center gap-1.5 text-[#a3a3a3] hover:text-white px-2 py-2"
                aria-label="Entrar"
              >
                <User size={16} />
                <span className="hidden xl:inline">Entrar</span>
              </Link>
              
              <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full transition-colors hover:bg-white/5 text-[#F6F1EB]"
                aria-label="Sacola"
              >
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#c9a263] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <Link 
                to="/cafes" 
                className="bg-[#F6F1EB] text-[#160F0A] px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#c9a263] active:scale-[0.98] transition-all ml-1"
              >
                <span className="hidden xl:inline">Comprar cafés</span>
                <span className="xl:hidden">Comprar</span>
              </Link>
            </div>

            {/* Mobile/Tablet Menu Toggle & Items */}
            <div className="flex lg:hidden items-center gap-2 z-50">
              <Link 
                to="/cafes" 
                className="hidden md:inline-flex bg-[#F6F1EB] text-[#160F0A] px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#c9a263] active:scale-[0.98] transition-all ml-1 mr-2"
              >
                Comprar
              </Link>
               <button 
                onClick={toggleCart}
                className="relative p-2 text-[#F6F1EB] hover:bg-white/5 rounded-full"
                aria-label="Sacola"
              >
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#c9a263] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#F6F1EB] hover:bg-white/5 rounded-full focus:outline-none focus:ring-1 focus:ring-[#c9a263]"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="fixed inset-0 top-0 pt-32 bg-[#0a0a0a]/95 backdrop-blur-xl text-white z-40 flex flex-col px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                return (
                  <Link key={link.href} to={link.href} className={cn("transition-colors", isActive ? "text-[#c9a263]" : "text-white hover:text-[#c9a263]")}>
                    {link.label}
                  </Link>
                );
              })}
              <hr className="border-white/10 my-4" />
              <Link to="/login" className="hover:text-white transition-colors flex items-center gap-3 text-lg font-sans text-[#a3a3a3]">
                <User size={22} />
                Entrar
              </Link>
              <Link 
                to="/cafes" 
                className="md:hidden mt-4 bg-[#F6F1EB] text-[#160F0A] px-8 py-4 rounded-xl font-bold uppercase text-center text-sm tracking-widest hover:bg-[#c9a263] transition-colors"
              >
                Comprar cafés
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
