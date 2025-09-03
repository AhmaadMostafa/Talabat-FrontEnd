import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBasketStore } from '@/stores/basketStore'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import BasketSummary from '@/components/basket/BasketSummary'
import type { BasketItem } from '@/types'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { basket } = useBasketStore()
  const [orderCreated, setOrderCreated] = useState(false)

  const handleOrderCreated = (orderId: number) => {
    setOrderCreated(true)
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate(`/checkout/success?orderId=${orderId}`)
    }, 2000)
  }

  if (!basket || basket.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Your basket is empty.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (orderCreated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-green-700 mb-4">
              Thank you for your order. You will be redirected to the order confirmation page shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onOrderCreated={handleOrderCreated} />
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <BasketSummary 
                items={basket.items as BasketItem[]} 
                isBasket={false}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}