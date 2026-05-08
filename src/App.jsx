import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Services from './pages/Services.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useCart } from './context/CartContext.jsx';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <CartDrawer />
  </>
);

const AdminLayout = ({ children }) => <>{children}</>;

const App = () => {
  const location = useLocation();
  const { toast } = useCart();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/collection" element={<PublicLayout><Collection /></PublicLayout>} />
          <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminLayout><AdminProducts /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout><AdminOrders /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <ProtectedRoute>
                <AdminLayout><AdminEnquiries /></AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      {toast && <Toast message={toast} />}
    </>
  );
};

export default App;
