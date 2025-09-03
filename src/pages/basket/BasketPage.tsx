import { Link } from 'react-router-dom'
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from 'react-icons/fa'
import { useBasketStore } from '@/stores/basketStore'
import { useAuthStore } from '@/stores/authStore'
import BasketSummary from '@/components/basket/BasketSummary'
import OrderTotals from '@/components/shared/OrderTotals'

export default function BasketPage() {
  const { basket, basketTotals, incrementItemQuantity, decrementItemQuantity, removeItemFromBasket } = useBasketStore()
  const { isAuthenticated } = useAuthStore()

  if (!basket || basket.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <FaShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your basket is empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your basket</p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Basket</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basket Items */}
        <div className="lg:col-span-2">
          <BasketSummary
            items={basket.items}
            isBasket={true}
            onIncrement={incrementItemQuantity}
            onDecrement={decrementItemQuantity}
            onRemove={removeItemFromBasket}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          {basketTotals && (
            <div className="bg-gray-50 rounded-lg p-6">
              <OrderTotals
                subtotal={basketTotals.subtotal}
                shipping={basketTotals.shipping}
                total={basketTotals.total}
              />
              
              <div className="mt-6 space-y-3">
                {isAuthenticated ? (
                  <Link
                    to="/checkout"
                    className="btn btn-primary w-full block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      Please log in to proceed with checkout
                    </p>
                    <Link
                      to="/account/login"
                      state={{ from: { pathname: '/checkout' } }}
                      className="btn btn-primary w-full block text-center"
                    >
                      Login to Checkout
                    </Link>
                  </div>
                )}
                
                <Link
                  to="/shop"
                  className="btn btn-outline w-full block text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}