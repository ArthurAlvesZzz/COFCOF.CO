import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import B2B from './pages/B2B';
import Wholesale from './pages/Wholesale';
import Origin from './pages/Origin';
import MapPartners from './pages/MapPartners';
import PartnerProfile from './pages/PartnerProfile';
import Subscription from './pages/Subscription';
import About from './pages/About';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderPending from './pages/OrderPending';
import OrderFailure from './pages/OrderFailure';

import ProtectedAdminRoute from './components/layout/ProtectedAdminRoute';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cafes" element={<Catalog />} />
          <Route path="cafes/:slug" element={<Product />} />
          <Route path="empresas" element={<B2B />} />
          <Route path="atacado" element={<Wholesale />} />
          <Route path="origem" element={<Origin />} />
          <Route path="parceiros" element={<MapPartners />} />
          <Route path="parceiros/:slug" element={<PartnerProfile />} />
          <Route path="onde-encontrar" element={<MapPartners />} />
          <Route path="onde-encontrar/:slug" element={<PartnerProfile />} />
          <Route path="assinatura" element={<Subscription />} />
          <Route path="sobre" element={<About />} />
          <Route path="login" element={<Login />} />
        </Route>
        
        {/* Standalone routes for cleaner UX */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/sucesso" element={<OrderSuccess />} />
        <Route path="/pedido/pendente" element={<OrderPending />} />
        <Route path="/pedido/falha" element={<OrderFailure />} />
        
        {/* Admin hidden routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/cofcof-secure" element={<Admin />} />
        </Route>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

