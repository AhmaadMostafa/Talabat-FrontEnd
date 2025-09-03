import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useBasketStore } from '@/stores/basketStore'

// Layout components
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'

// Page components
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/shop/ShopPage'
import ProductDetailPage from '@/pages/shop/ProductDetailPage'
import BasketPage from '@/pages/basket/BasketPage'
import CheckoutPage from '@/pages/checkout/CheckoutPage'
import CheckoutSuccessPage from '@/pages/checkout/CheckoutSuccessPage'
import OrdersPage from '@/pages/orders/OrdersPage'
import OrderDetailPage from '@/pages/orders/OrderDetailPage'
import LoginPage from '@/pages/account/LoginPage'
import RegisterPage from '@/pages/account/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ServerErrorPage from '@/pages/ServerErrorPage'

// Route guards
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  const { loadCurrentUser } = useAuthStore()
  const { getBasket } = useBasketStore()

  useEffect(() => {
    // Load current user if token exists
    loadCurrentUser()
    
    // Load basket if basket_id exists
    const basketId = localStorage.getItem('basket_id')
    if (basketId) {
      getBasket(basketId)
    }
  }, [loadCurrentUser, getBasket])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ProductDetailPage />} />
          <Route path="/basket" element={<BasketPage />} />
          
          {/* Protected routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Auth routes */}
          <Route path="/account/login" element={<LoginPage />} />
          <Route path="/account/register" element={<RegisterPage />} />
          
          {/* Error pages */}
          <Route path="/server-error" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App