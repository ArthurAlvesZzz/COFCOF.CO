import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isMapRoute = pathname === '/parceiros';

  return (
    <div className={isMapRoute ? "h-dvh flex flex-col font-sans bg-[#F6F1EB] text-cof-black overflow-hidden w-full relative" : "min-h-screen flex flex-col font-sans bg-cof-cream text-cof-black overflow-x-hidden w-full"}>
      <Navbar />
      <CartDrawer />
      <main className={`w-full max-w-full ${isMapRoute ? 'absolute inset-0 h-full w-full p-0 m-0' : 'flex-grow pt-[88px] md:pt-[104px]'}`}>
        <Outlet />
      </main>
      {!isMapRoute && <Footer />}
    </div>
  );
}
