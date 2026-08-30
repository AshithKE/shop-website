import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartToast from './components/CartToast'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import ProtectedCustomerRoute from './components/ProtectedCustomerRoute'
import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import About from './pages/About'
import Contact from './pages/Contact'
import TrackOrder from './pages/TrackOrder'
import CustomerAuth from './pages/CustomerAuth'
import CustomerOrders from './pages/CustomerOrders'
import CustomerProfile from './pages/CustomerProfile'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<CustomerAuth />} />
          <Route path="/signup" element={<CustomerAuth />} />
          <Route
            path="/shop"
            element={
              <ProtectedCustomerRoute>
                <Menu />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedCustomerRoute>
                <Cart />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedCustomerRoute>
                <Checkout />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedCustomerRoute>
                <CustomerOrders />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedCustomerRoute>
                <CustomerProfile />
              </ProtectedCustomerRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartToast />
      <WhatsAppButton />
    </div>
  )
}
